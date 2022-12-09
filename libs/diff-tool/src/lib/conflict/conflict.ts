export class Conflict {
  constructor(
    public readonly current: string | undefined | null,
    public readonly incoming: string | undefined | null,
    public readonly currentName?: string,
    public readonly incomingName?: string
  ) {
    this.current = this.current?.replace(/\n$/, '');
    this.incoming = this.incoming?.replace(/\n$/, '');
  }

  public get length(): number {
    return (
      (this.current?.split('\n').length ?? 0) +
      (this.incoming?.split('\n').length ?? 0)
    );
  }

  public toString(): string {
    return [
      `<<<<<<<${this.currentName ? ` ${this.currentName}` : ''}`,
      this.current,
      '=======',
      this.incoming,
      `>>>>>>>${this.incomingName ? ` ${this.incomingName}` : ''}`,
    ]
      .filter((line) => line != null)
      .join('\n');
  }
}
