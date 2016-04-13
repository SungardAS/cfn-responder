# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [0.1.5] - 2016-04-12

### Added
- If event.Reason exists then it will be used as the error value

### Changed
- If the CloudFormation resource fails the error will be logged and
  returned to context.done

