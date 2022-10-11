type FakeTimers = GlobalFakeTimersConfig &
  (
    | (FakeTimersConfig & {
        now?: Exclude<FakeTimersConfig['now'], Date>;
      })
    | LegacyFakeTimersConfig
  );
