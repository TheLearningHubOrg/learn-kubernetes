/**
 * The Learning Hub - Kubernetes (k8s) & Cloud-Native SRE Roadmap
 */

export const K8S_STAGES = [
  {
    stageNumber: 1,
    title: "Container Orchestration & Control Plane Architecture",
    domainFocus: "kube-apiserver, etcd Raft consensus, kube-scheduler, kube-controller-manager",
    completed: true,
    keyTopics: ["Control Plane Topology", "Worker Node Components (kubelet, kube-proxy, CRI)", "Declarative Reconciliation", "etcd Quorum"]
  },
  {
    stageNumber: 2,
    title: "Workload Controllers & Pod Lifecycle",
    domainFocus: "Deployments, ReplicaSets, StatefulSets, DaemonSets, Jobs, CronJobs, and Pod phase transitions",
    completed: true,
    keyTopics: ["RollingUpdate vs Recreate", "StatefulSet Ordinal Indexing", "InitContainers & Sidecars", "Disruption Budgets (PDB)"]
  },
  {
    stageNumber: 3,
    title: "Networking, Services & Ingress Mesh",
    domainFocus: "CNI plugins, ClusterIP, NodePort, LoadBalancer, Ingress controllers, Gateway API, and NetworkPolicies",
    completed: true,
    keyTopics: ["kube-proxy iptables/IPVS", "CoreDNS Service Discovery", "Gateway API v1", "Zero-Trust NetworkPolicies"]
  },
  {
    stageNumber: 4,
    title: "Persistent Storage & CSI Architecture",
    domainFocus: "StorageClasses, PersistentVolumes (PV), PersistentVolumeClaims (PVC), and dynamic CSI provisioning",
    completed: true,
    keyTopics: ["Container Storage Interface (CSI)", "Volume Modes (Filesystem vs Block)", "Reclaim Policies", "Stateful PVC expansion"]
  },
  {
    stageNumber: 5,
    title: "Security, RBAC, Admission & Secret Management",
    domainFocus: "Role-Based Access Control, ServiceAccounts, Validating/Mutating Webhooks, Pod Security Standards",
    completed: true,
    keyTopics: ["RBAC Roles & Bindings", "Cert-Manager & TLS", "Open Policy Agent (OPA) / Kyverno", "HashiCorp Vault External Secrets"]
  },
  {
    stageNumber: 6,
    title: "Observability, Telemetry & Auto-Scaling",
    domainFocus: "Prometheus Operator, OpenTelemetry collectors, Horizontal Pod Autoscaler (HPA), Karpenter",
    completed: true,
    keyTopics: ["Prometheus ServiceMonitors", "Custom Metrics API", "HPA Algorithm", "Cluster Autoscaler / Karpenter"]
  },
  {
    stageNumber: 7,
    title: "Staff Cloud-Native Architect Interview Handbook",
    domainFocus: "40+ staff scenario Q&As, split-brain etcd recovery, node pressure eviction storms, zero-downtime upgrades",
    completed: true,
    keyTopics: ["etcd Disaster Recovery", "Node Eviction Priority", "CRD Custom Controllers / Kubebuilder", "Multi-Cluster Federation"]
  }
];

export function getCompletedCount() {
  return K8S_STAGES.filter(s => s.completed).length;
}

export function getProgressPercentage() {
  return Math.round((getCompletedCount() / K8S_STAGES.length) * 100);
}
