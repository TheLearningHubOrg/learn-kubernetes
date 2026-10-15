import { calculateQuorum, maxFaultyNodes, getQoSClass, simulateScheduler, simulateRollingUpdate } from './k8s-engine.mjs';
import { K8S_STAGES, getCompletedCount, getProgressPercentage } from './roadmap.mjs';

console.log('======================================================');
console.log('  The Learning Hub - Kubernetes (k8s) & Cloud Native SRE');
console.log('======================================================');
console.log('Orchestrator: Kubernetes Control Plane & Kubelet Engine');
console.log('State Store: etcd Distributed Raft Consensus\n');

// 1. etcd Raft Quorum Mathematics
console.log('--- 1. etcd Raft Quorum & Fault Tolerance Invariants ---');
[3, 4, 5, 7].forEach(nodes => {
  const q = calculateQuorum(nodes);
  const f = maxFaultyNodes(nodes);
  console.log(`Cluster Size: ${nodes} nodes | Quorum Required: ${q} | Tolerates Failures: ${f} nodes`);
});

// 2. Pod QoS Tier Computation
console.log('\n--- 2. Pod Quality of Service (QoS) Eviction Engine ---');
const pods = [
  {
    name: 'api-service-prod',
    containers: [{ requests: { cpu: '1000m', memory: '2Gi' }, limits: { cpu: '1000m', memory: '2Gi' } }]
  },
  {
    name: 'batch-worker',
    containers: [{ requests: { cpu: '250m', memory: '512Mi' }, limits: { cpu: '1000m', memory: '1Gi' } }]
  },
  {
    name: 'log-shipper-sidecar',
    containers: [{ requests: {}, limits: {} }]
  }
];

pods.forEach(p => {
  const qos = getQoSClass(p.containers);
  console.log(`  Pod: ${p.name.padEnd(20)} -> QoS Class: ${qos}`);
});

// 3. Scheduler Placement Simulation
console.log('\n--- 3. kube-scheduler Filter & Priority Placement ---');
const clusterNodes = [
  { name: 'worker-node-1', availableCpuMillis: 2000, availableMemoryMiB: 4096, cordoned: false },
  { name: 'worker-node-2', availableCpuMillis: 4000, availableMemoryMiB: 8192, cordoned: false },
  { name: 'worker-node-3', availableCpuMillis: 1000, availableMemoryMiB: 2048, cordoned: true } // cordoned
];

const newPod = { name: 'payment-service', cpuRequest: 500, memoryRequest: 1024 };
const scheduleResult = simulateScheduler(newPod, clusterNodes);
console.log(`Scheduled '${newPod.name}' onto node: ${scheduleResult.node} (status: ${scheduleResult.scheduled ? 'SUCCESS' : 'FAILED'})\n`);

// 4. RollingUpdate Deployment Strategy
console.log('--- 4. RollingUpdate Strategy Metrics ---');
const rollout = simulateRollingUpdate(6, 25, 25);
console.log(`Desired Replicas: ${rollout.desiredReplicas}`);
console.log(`Max Surge: +${rollout.maxSurge} pods (max concurrent: ${rollout.maxAllowedPods})`);
console.log(`Max Unavailable: -${rollout.maxUnavailable} pods (min available: ${rollout.minAvailablePods})\n`);

// 5. 7-Stage Pedagogical Roadmap
console.log('--- 5. 7-Stage Kubernetes Masterclass Roadmap ---');
for (const stage of K8S_STAGES) {
  const icon = stage.completed ? '[OK]' : '[..]';
  console.log(` ${icon} Stage ${stage.stageNumber}: ${stage.title}`);
  console.log(`      Focus: ${stage.domainFocus}`);
  console.log(`      Topics: ${stage.keyTopics.join(', ')}`);
}

const completed = getCompletedCount();
const percent = getProgressPercentage();
console.log('------------------------------------------------------');
console.log(`Progress: ${completed}/7 Stages Complete (${percent}%)`);
console.log('======================================================\n');
