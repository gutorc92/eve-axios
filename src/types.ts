import axios, { AxiosResponse } from "axios"

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
    return api.get(fullURL).then((response: AxiosResponse<Response<T>>) => {
      return response.data._items || response.data.data
    })
  }

  async getResourceByID<T> (id: string) : Promise<any> {
    const fullURL = `${this.url}/${id}`
    return api.get(fullURL).then((response: AxiosResponse) => {
      return response.data as T
    })
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

export type Area = {
  name: string
  
}
export class AreaResource extends BaseResource {
  url = 'area'
  

  get (options?: PaginationOptions) : Promise<any> {
    return this.getResource<Area[]>(options)
  }

  getByName(id: string) : Promise<any> {
    return this.getResourceByID<Area>(id)
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