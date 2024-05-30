type IDbDevice = {
  device_id: string;
  user_id: string;
  title: string;
  ip: string;
  latitude?: string;
  longitude?: string;
  platform: string;
  model: string;
  is_logged: boolean;
  flag: number;
  last_login?: string;
};

export default IDbDevice;
