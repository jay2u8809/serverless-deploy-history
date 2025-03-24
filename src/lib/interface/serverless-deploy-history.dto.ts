export class ServerlessDeployHistoryDto {
  // fields
  private _name: string;
  private _stage: string;
  private _userName: string;
  private _revision: string;
  private _branch: string;
  private _endAt: string;
  private _localEndAt: string;

  // getter and setter
  public get name(): string {
    return this._name;
  }
  public set name(value: string) {
    this._name = value;
  }

  public get stage(): string {
    return this._stage;
  }
  public set stage(value: string) {
    this._stage = value || 'dev';
  }

  public get userName(): string {
    return this._userName;
  }
  public set userName(value: string) {
    this._userName = value || 'NoName';
  }

  public get revision(): string {
    return this._revision;
  }
  public set revision(value: string) {
    this._revision = value || 'NoRevision';
  }

  public get branch(): string {
    return this._branch;
  }
  public set branch(value: string) {
    this._branch = value || 'NoBranch';
  }

  public get endAt(): string {
    return this._endAt;
  }
  public set endAt(value: string) {
    this._endAt = value || new Date().toISOString();
  }

  public get localEndAt(): string {
    return this._localEndAt;
  }
  public set localEndAt(value: string) {
    this._localEndAt = value || new Date().toLocaleString();
  }
}
