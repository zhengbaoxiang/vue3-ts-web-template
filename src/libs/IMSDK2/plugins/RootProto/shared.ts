import { IMActionEnum } from '../../constants'

interface Model<T> {
  create: (props: T) => Model<T>
  encode: (model: Model<T>) => { finish: () => Uint8Array }
  decode: (buffer: Uint8Array) => Model<T>
  verify: (model: {
    Seq: number
    ChannelID?: string
    ContentType?: number
    Content: string
    Persist: boolean
    Ack?: boolean
  }) => string | null
}

interface IM_LoginTokenProps {
  UserID: string
  Token: string
  Device: string
  Version: string
  Appkey: string
}

interface IM_ChannelProps {
  ChannelID: string
  type: number
}

export interface Root {
  [IMActionEnum.IM_Channel]: Model<IM_ChannelProps>
  [IMActionEnum.IM_LoginToken]: Model<IM_LoginTokenProps>
  [IMActionEnum.IM_ReceiveChannelMessage]: Model<any>
  [IMActionEnum.IM_Feedback]: Model<any>
  [IMActionEnum.IM_ReceiveRecallMsg]: Model<any>
  [IMActionEnum.IM_ReceivePrivateMessage]: Model<any>
  [IMActionEnum.IM_ReceiveGroupMessage]: Model<any>
  [IMActionEnum.IM_ServerNotice]: Model<any>
  [IMActionEnum.IM_SendChannelMessage]: Model<any>
  [IMActionEnum.IM_SendPrivateMessage]: Model<any>
  [IMActionEnum.IM_SendGroupMessage]: Model<any>
  [IMActionEnum.IM_SendPrivateReceipt]: Model<any>
  [IMActionEnum.IM_ReceivePrivateReceipt]: Model<any>
  [IMActionEnum.IM_SendGroupReceipt]: Model<any>
}
