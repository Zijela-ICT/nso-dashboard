export interface Chapter {
  chapter: string;
  subChapters: SubChapter[];
  pages?: Page[];
}

export interface SubChapter {
  subChapterTitle: string; // Ensure this property exists
  subSubChapters?: SubSubChapter[]; // Add this line to include subSubChapters
  pages?: Page[];
}

export interface SubSubChapter {
  subSubChapterTitle: string; // Title for the subSubChapter
  pages: Page[]; // Pages under this subSubChapter
}

export interface Page {
  pageTitle: string;
  items: (Item | Linkable | IDecisionTree)[];
  markVisit?: boolean;
}

export type iContent = string | { text?: string; linkTo?: string }[];
export interface IAilment {
  findingsOnHistory: string;
  findingsOnExamination: string[]; // Related findings on examination
  clinicalJudgement: string; // Clinical judgement for the case
  actions: string[];
  decisionScore: number;
  decisionDependencies: string[];
}
export type IDecisionTree = {
  type: "decision";
  name: string;
  history: string[];
  examinationsActions: string[];
  findingsOnExamination: string[];
  cases: IAilment[];
  healthEducation: string[];
};

export interface UnorderedNestedListItem {
  content: string | Text | Linkable;
  nestedItems?: UnorderedList;
}

export interface UnorderedList {
  type: "unorderedList";
  items: (string | Text | Linkable | UnorderedNestedListItem)[];
  forDecisionTree?: boolean;
}

export type ItemTypes =
  | "unorderedList"
  | "orderedList"
  | "text"
  | "image"
  | "video"
  | "linkable"
  | "space"
  | "heading2"
  | "heading3"
  | "heading4"
  | "decision"
  | "table"
  | "listitem";

export interface Item {
  content?: iContent | Linkable | IDecisionTree | string[] | string;
  alt?: string;
  src?: string;
  type: ItemTypes;

  // decision_tree?: IDecisionTree;
  items?:
    | string[]
    | {
        [key: string]: iContent;
      };
  nestedItems?: { items: string[]; type: "unorderedList" };
  rows?: Array<
    Array<{ content: string; colSpan?: number; type: string } | string>
  >;
  headers?: Array<
    Array<{
      content: string;
      colSpan?: number;
      cellStyle?: object;
      type: string;
    }>
  >;
  style?: object;
  itemsPerPage?: number;
  showCellBorders?: boolean;
  headless?: boolean;
  title?: string;
  tableStyle?: { backgroundColor?: string; borderRadius?: number };
  forDecisionTree?: boolean;
}

export interface LinkableContent {
  text: string;
  linkTo?: string;
  linkType: "internal" | "external";
  textStyle?: object;
}

export interface Linkable {
  type: "linkable";
  title?: string;
  content: LinkableContent[];
  style?: object;
}

export interface Space {
  type: "space";
  content: string;
}

export interface Book {
  bookTitle: string;
  cert_sign: string;
  content: Chapter[];
  locales: Locales;
}

export interface Locales {
  [key: string]: {
    [key: string]: string | number | boolean | null | Record<string, unknown>;
  };
}

export interface Data {
  book: Book;
  locales: Locales;
}

export type iTargetElements =
  | HTMLParagraphElement
  | HTMLHeadingElement
  | HTMLLIElement;

export interface iPosition {
  x: number;
  y: number;
}

export interface FlattenedObj {
  data:
    | string
    | number
    | boolean
    | null
    | Item
    | object
    | Record<string, string | Item>;
  parentIndex: number[];
  dataPath?: string;
  forDecisionTree?: boolean;
  needsFixing?: boolean; // ignore. this was added to fix broken decision trees without their corresponding hidden items
  canAddNewItem?: boolean;
}

export interface FlattenedData {
  primitive: string | number | boolean | null;
  object: Record<string, unknown>;
  nestedArray: unknown[];
}

export interface TableHeader extends Item {
  rowSpan?: number;
  colSpan?: number;
  cellStyle?: Record<string, string>;
}

export interface TableRows {
  rowSpan?: number;
  colSpan?: number;
  cellStyle?: object;
}
export interface TableData {
  type: "table";
  title?: string;
  headers?: (TableHeader & Item)[][];
  rows: (TableRows & Item)[][];
  showCellBorders?: boolean;
  tableStyle?: object;
  headless?: boolean;
  itemsPerPage?: number;
  columnCount?: number;
  headerRowCount?: number;
  forDecisionTree?: boolean;
}

export enum PageItemType {
  Chapter = "chapter",
  SubChapter = "sub-chapter",
  SubSubChapter = "sub sub-chapter",
  Page = "page",
}
