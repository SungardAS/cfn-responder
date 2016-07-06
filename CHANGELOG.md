# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [0.1.6] - 2016-07-06

### Fixed
- When returning FAILED to CloudFormation exit the lambda function with
  a success to prevent retries. [issue #1]

- Always return PhysicalResourceId, even for FAILED Create requests.
  [issue #2]

## [0.1.5] - 2016-04-12

### Added
- If event.Reason exists then it will be used as the error value

### Changed
- If the CloudFormation resource fails the error will be logged and
  returned to context.done

