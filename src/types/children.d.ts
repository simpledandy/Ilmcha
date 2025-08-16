export interface Child {
  id: string;
  parent_id: string;
  name: string;
  avatar_url?: string;
  created_at: string;
  date_of_birth?: string;
}

export interface ChildStats {
  child_id: string;
  last_active?: string;
  total_xp: number;
  coins: number;
  stars: number;
}

export interface ChildWithStats extends Child {
  stats?: ChildStats;
}

export interface AddChildData {
  name: string;
  date_of_birth: string;
  avatar_url?: string;
}

export interface Parent {
  id: string;
  created_at: string;
  name: string;
} 