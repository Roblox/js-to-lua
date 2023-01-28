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

  public slice(start: number, end?: number): Conflict {
    return new Conflict(
      this.current?.split('\n').slice(start, end).join('\n'),
      this.incoming?.split('\n').slice(start, end).join('\n'),
      this.currentName,
      this.incomingName
    );
  }

  public hasContent(): this is Conflict & {
    current: string;
    incoming: string;
  } {
    return this.current != null && this.incoming != null;
  }
}
