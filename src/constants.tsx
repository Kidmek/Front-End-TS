export enum Type {
  Service,
  Category,
}
export enum View {
  Tree,
  List,
}

export enum Action {
  Delete,
  Update,
  Add,
}

export const zoomLevels: Array<number> = [
  25, 30, 40, 50, 60, 70, 80, 90, 100, 125, 150,
]

export type Category = {
  id: string
  name: string
  type: Type
  subCategories: Array<Category>
}
