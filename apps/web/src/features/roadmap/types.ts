export interface RoadmapNodeItem {
  id: string;
  title: string;
  category?: string;
  description?: string;
  subNodes?: RoadmapNodeItem[];
}

export interface RoadmapSection {
  mainTitle: string;
  mainId: string;
  description?: string;
  leftNodes?: RoadmapNodeItem[];
  rightNodes?: RoadmapNodeItem[];
  subSections?: {
    title: string;
    nodes: RoadmapNodeItem[];
  }[];
}
