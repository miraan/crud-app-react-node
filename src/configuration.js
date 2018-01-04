// @flow

type AppConfiguration = {
  apiHost: string,
  facebookAppId: string,
  facebookProfileFields: string,
}

const AppConfigurationObject: AppConfiguration = {
  apiHost: 'http://localhost:3001',
  facebookAppId: '419380475146250',
  facebookProfileFields: 'id,first_name,last_name,email',
}

export default AppConfigurationObject
