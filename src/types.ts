export class Meta {
  page: number = 0
  max_results: number = 0
  total: number = 0
}
export class Link {
  title: string = ""
  href: string = ""
}

export class Links{
  parent: Link = new Link()
  self: Link = new Link()
}

export class Response<T> {
  _items: Array<T> = new Array<T>()
  _meta: Meta = new Meta()
  _links: Links = new Links()
}