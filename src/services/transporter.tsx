export default abstract class Transporter {
  protected token: string | null = null
  public readonly ready: boolean = false
  constructor (token: string) {
    this.token = token
    this.ready = true
  }
}
