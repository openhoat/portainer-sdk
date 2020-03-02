class PortainerError extends Error {
  protected static handleArgs(
    message?: string | Error,
    origin?: any,
  ): {
    message?: string
    origin?: any
  } {
    const args: {
      message?: string
      origin?: any
    } = {}
    if (message instanceof Error) {
      args.origin = message
      args.message = args.origin.message
    } else {
      args.origin = origin
      args.message = message
    }
    return args
  }

  protected readonly _origin?: any

  constructor(message?: string, origin?: any) {
    const args = PortainerError.handleArgs(message, origin)
    super(args.message)
    this._origin = args.origin
    const actualProto = new.target.prototype
    Object.setPrototypeOf(this, actualProto)
  }

  public get origin(): any | undefined {
    return this._origin
  }
}

export { PortainerError }
