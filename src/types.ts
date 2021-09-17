import axios from "axios"

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
  data?: Array<T> = new Array<T>()
  _items?: Array<T> = new Array<T>()
  _meta?: Meta = new Meta()
  _links?: Links = new Links()

}

export interface PaginationOptions {
  page?: number
  maxPerPage?: number

  
}

const api = axios.create({
  baseURL: 'http://localhost:8000',
  auth: {
    username: process.env.USER_API || 'admin',
    password: process.env.PASS || 'admin'
  }
})
export class BaseResource {

  url: string = ''

  options: string[] = Array()

  getResource<T> (options?: PaginationOptions) : Promise<any> {
    this.pageParameters(options)
    const fullURL = this.options.length > 0 ? `${this.url}?${this.options.join('&')}` : `${this.url}`
    console.log(fullURL)
    return api.get<T>(fullURL)
  }

  pageParameters (options?: PaginationOptions) {
    if (options?.page !== 1 && options?.page !== undefined) {
      this.options.push(`page=${options?.page}`)
    }
    if (options?.maxPerPage !== 50 && options?.maxPerPage !== undefined) {
      this.options.push(`max_per_page=${options?.maxPerPage}`)
    }
  }

}

export interface Area {
  name: string
  
}
export class AreaResource extends BaseResource {
  url = 'areas'
  

  get (options?: PaginationOptions) : Promise<any> {
    return this.getResource<Area[]>(options)
  }
}

export type BasicType = {
  _id: string
  _etag: string
  _updated: string
  _created: string
  _links?: Links
}

export type User = BasicType & {
  email: string
  name: string
}

export class UserResource extends BaseResource {
  url = 'user'
  

  get (options?: PaginationOptions) : Promise<any> {
    return this.getResource<Response<User[]>>(options)
  }
}