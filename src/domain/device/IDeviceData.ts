import DeviceFlag from './DeviceFlag';

type IDeviceData = {
  deviceId: string;
  userId: string;
  title: string;
  ip: string;
  latitude?: string;
  longitude?: string;
  platform: string;
  model: string;
  isLogged: boolean;
  flag: DeviceFlag;
  lastLogin?: string;
};

export default IDeviceData;
