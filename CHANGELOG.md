# Changelog 

[Unreleased changes](https://github.com/rapidez/gtm/compare/3.0.0...3.0.0)
## [3.0.0](https://github.com/rapidez/gtm/releases/tag/3.0.0) - 2024-12-13

### Added

- Rapidez v3 support (#29)

## [2.1.3](https://github.com/rapidez/gtm/releases/tag/2.1.3) - 2024-11-12

### Fixed

- Check for cart items existing (#30)

## [2.1.2](https://github.com/rapidez/gtm/releases/tag/2.1.2) - 2024-09-16

### Fixed

- Remove Authorization header adding (#28)

## [2.1.1](https://github.com/rapidez/gtm/releases/tag/2.1.1) - 2024-06-11

### Fixed

- Get cart items from graphql definition (#27)

## [2.1.0](https://github.com/rapidez/gtm/releases/tag/2.1.0) - 2024-05-31

### Added

- Optionally fire purchase or checkout_success event on the success page (#26)

## [2.0.0](https://github.com/rapidez/gtm/releases/tag/2.0.0) - 2024-05-28

### Added

- Laravel 11 support (#25)
- Support tag assistant debugger in Partytown (#23)

### Changed

- Make GA4 the default event sender (#24)

### Fixed

- Properly replace phone number characters (#22)
- 

## [1.0.0](https://github.com/rapidez/gtm/releases/tag/1.0.0) - 2024-03-01

### Added

- Rapidez v2 support (#21)

## [0.16.1](https://github.com/rapidez/gtm/releases/tag/0.16.1) - 2024-02-27

### Fixed

- Fix dataLayer in window check (#20)

## [0.16.0](https://github.com/rapidez/gtm/releases/tag/0.16.0) - 2024-02-23

### Added

- Enhanced Conversions with user data (#16)

## [0.15.1](https://github.com/rapidez/gtm/releases/tag/0.15.1) - 2024-02-20

### Fixed

- Add store to elgentos graphql request (#19)
- Defined sendDataLayer (#18)

## [0.15.0](https://github.com/rapidez/gtm/releases/tag/0.15.0) - 2024-02-14

### Added

- Add v-item-list directive for view_item_list (#15)

## [0.14.0](https://github.com/rapidez/gtm/releases/tag/0.14.0) - 2023-11-30

### Changed

- Move config file to Rapidez folder (#14)

## [0.13.1](https://github.com/rapidez/gtm/releases/tag/0.13.1) - 2023-11-29

### Fixed

- Use entity_id with fallback to id (#13)

## [0.13.0](https://github.com/rapidez/gtm/releases/tag/0.13.0) - 2023-10-31

### Fixed

- Use authorization header from core if it is filled
- Support new elgentos schema from 1.2.0+


## [0.12.2](https://github.com/rapidez/gtm/releases/tag/0.12.2) - 2023-10-12

### Fixed

- Add authorisation options back again

## [0.12.1](https://github.com/rapidez/gtm/releases/tag/0.12.1) - 2023-10-12

### Added

- Add support for the new serverside analytics (#10)

## [0.12.0](https://github.com/rapidez/gtm/releases/tag/0.12.0) - 2023-10-11

### Added

- Make CartId required (#9)

## [0.11.3](https://github.com/rapidez/gtm/releases/tag/0.11.3) - 2023-09-22

### Added

- Laravel 10 support (31a8617)

## [0.11.2](https://github.com/rapidez/gtm/releases/tag/0.11.2) - 2023-09-07

### Fixed

- Ensure datalayer providers are imported before sending pageview events (#8)

## [0.11.1](https://github.com/rapidez/gtm/releases/tag/0.11.1) - 2023-09-07

### Fixed

- Prevent top level await not available error when building (#7)

## [0.11.0](https://github.com/rapidez/gtm/releases/tag/0.11.0) - 2023-09-06

### Added

- GA4 events (#6)

## [0.10.0](https://github.com/rapidez/gtm/releases/tag/0.10.0) - 2023-08-25

### Added

- Possibility to disable GTM with an url param (e446d92)

## [0.9.0](https://github.com/rapidez/gtm/releases/tag/0.9.0) - 2023-08-24

### Added

- Partytown support (#3)

## [0.8.0](https://github.com/rapidez/gtm/releases/tag/0.8.0) - 2023-08-23

### Added

- Rapidez/core v1 support (029df30)

## [0.7.0](https://github.com/rapidez/gtm/releases/tag/0.7.0) - 2023-04-11

### Changed

- Configurable clear on load and productpage data from a config (39b46ac)

## [0.6.0](https://github.com/rapidez/gtm/releases/tag/0.6.0) - 2023-04-05

### Added

- Add package.js, update readme (#2)

## [0.5.1](https://github.com/rapidez/gtm/releases/tag/0.5.1) - 2023-02-22

### Bugfix

- Use the correct event data which changed with the Turbo migration (1d73a12)

## [0.5.0](https://github.com/rapidez/gtm/releases/tag/0.5.0) - 2023-01-19

### Changed

- Replace turbolinks with turbo (#1)
- Add changelog action (8f2af92)

## [0.4.0](https://github.com/rapidez/gtm/releases/tag/0.4.0) - 2022-11-08

### Changed

- Clear dataLayer on every Turbolinks load (5406164)

## [0.3.0](https://github.com/rapidez/gtm/releases/tag/0.3.0) - 2022-08-11

### Added

- Multistore support (8b08b0c)

## [0.2.0](https://github.com/rapidez/gtm/releases/tag/0.2.0) - 2022-08-05

### Added

- Send products with checkout steps (37f0a5a)

## [0.1.0](https://github.com/rapidez/gtm/releases/tag/0.1.0) - 2022-07-22

Initial release

