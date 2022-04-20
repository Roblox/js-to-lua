class Config {
  public config: YGConfig;

  static create(): Config {
    return new Config();
  }

  constructor() {
    this.config = YGConfigNew();
  }

  free(): void {
    YGConfigFree(this.config);
  }

  setExperimentalFeatureEnabled(feature: number, enabled: boolean): void {
    YGConfigSetExperimentalFeatureEnabled(this.config, feature, enabled);
  }

  setPointScaleFactor(pixelsInPoint: number): void {
    YGConfigSetPointScaleFactor(this.config, pixelsInPoint);
  }

  isExperimentalFeatureEnabled(feature: number): boolean {
    return YGConfigIsExperimentalFeatureEnabled(this.config, feature);
  }
}
