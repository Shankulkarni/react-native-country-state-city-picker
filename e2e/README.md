# E2E Tests (Maestro)

End-to-end tests for the example app using [Maestro](https://maestro.mobile.dev/).

## Prerequisites

```bash
# Install Maestro
curl -Ls "https://get.maestro.mobile.dev" | bash

# Start the example app on a simulator/emulator
cd example
bun ios  # or bun android
```

## Running Tests

```bash
# Run all flows
maestro test e2e/

# Run a single flow
maestro test e2e/01-full-cascade.yaml

# Run with studio (visual debugger)
maestro studio
```

## Test Flows

| #   | Flow                                      | Screen      |
| --- | ----------------------------------------- | ----------- |
| 01  | Full cascade: country → state → city      | Basic       |
| 02  | Cascade reset on country change           | Basic       |
| 03  | Country with no states ("Not applicable") | Basic       |
| 04  | Search filter + no results                | Basic       |
| 05  | Diacritic-insensitive search              | Basic       |
| 06  | Modal dismiss via backdrop                | Basic       |
| 07  | Dark theme applies                        | Theme       |
| 08  | i18n labels (Spanish)                     | Labels      |
| 09  | Custom render props trigger               | RenderProps |
| 10  | Custom render props empty state           | RenderProps |
| 11  | Preset country pre-fills                  | Presets     |
| 12  | usePresetSelection hook resolution        | Presets     |
| 13  | Scroll performance (250+ items)           | Basic       |
| 14  | Keyboard avoidance                        | Basic       |

## Notes

- Tests use `testID` props for reliable element targeting
- Network-dependent tests (presets) use `extendedWaitUntil` with generous timeouts
- Flows are independent and can run in any order
