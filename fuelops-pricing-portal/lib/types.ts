export type PortalRole = "viewer" | "pricing_manager" | "admin";
export type Profile = { id:string; email:string; full_name:string|null; role:string; portal_role:PortalRole; title?:string|null; avatar_url?:string|null; created_at:string };
