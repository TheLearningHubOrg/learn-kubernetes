/**
 * Kubernetes Control Plane & Orchestration Simulator
 */

export function calculateQuorum(nodes) {
  return Math.floor(nodes / 2) + 1;
}

export function maxFaultyNodes(nodes) {
  return Math.floor((nodes - 1) / 2);
}

export function getQoSClass(containers) {
  let allRequestsEqualLimits = true;
  let anySpecified = false;

  for (const c of containers) {
    const hasReqCpu = c.requests?.cpu !== undefined;
    const hasReqMem = c.requests?.memory !== undefined;
    const hasLimCpu = c.limits?.cpu !== undefined;
    const hasLimMem = c.limits?.memory !== undefined;

    if (hasReqCpu || hasReqMem || hasLimCpu || hasLimMem) {
      anySpecified = true;
    }

    if (!(hasReqCpu && hasReqMem && hasLimCpu && hasLimMem &&
          c.requests.cpu === c.limits.cpu &&
          c.requests.memory === c.limits.memory)) {
      allRequestsEqualLimits = false;
    }
  }

  if (allRequestsEqualLimits) return 'Guaranteed';
  if (anySpecified) return 'Burstable';
  return 'BestEffort';
}

export function simulateScheduler(pod, nodes) {
  // 1. Filter nodes (Predicates)
  const eligible = nodes.filter(node => {
    return node.availableCpuMillis >= (pod.cpuRequest || 100) &&
           node.availableMemoryMiB >= (pod.memoryRequest || 128) &&
           !node.cordoned;
  });

  if (eligible.length === 0) {
    return { scheduled: false, node: null, reason: 'Insufficient node capacity (0/N nodes available)' };
  }

  // 2. Score nodes (Priorities) - LeastAllocated priority scoring
  eligible.sort((a, b) => {
    const scoreA = a.availableCpuMillis + a.availableMemoryMiB;
    const scoreB = b.availableCpuMillis + b.availableMemoryMiB;
    return scoreB - scoreA;
  });

  const selected = eligible[0];
  selected.availableCpuMillis -= (pod.cpuRequest || 100);
  selected.availableMemoryMiB -= (pod.memoryRequest || 128);

  return { scheduled: true, node: selected.name };
}

export function simulateRollingUpdate(desiredReplicas, maxSurgePercent = 25, maxUnavailablePercent = 25) {
  const maxSurge = Math.ceil(desiredReplicas * (maxSurgePercent / 100));
  const maxUnavailable = Math.floor(desiredReplicas * (maxUnavailablePercent / 100));
  const maxAllowedPods = desiredReplicas + maxSurge;
  const minAvailablePods = desiredReplicas - maxUnavailable;

  return {
    desiredReplicas,
    maxSurge,
    maxUnavailable,
    maxAllowedPods,
    minAvailablePods
  };
}
