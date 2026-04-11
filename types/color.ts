export type Tag = {
    id: string
    name: string
    color?: string
}

export type Color = {
    id: string
    name: string | null
    hex: string | null
    r: number
    g: number
    b: number
    group_id? : string
    color_tags:{
        tag: Tag
    }[]
}