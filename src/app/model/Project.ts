export interface Project {
    id: number;
    projectName: string;
    projectCode: string;
    contractor: string;
    consultant: string;
    location: string;
    children?: ProjectChild[]; // Array of child data
  }
  
  export interface ProjectChild {
  projectId: number;
  flow: string;
  head: string;
  pumpSeries: string;
  pumpModel: string;
  pumpSize: string;
  application: string;
  configuration: string;
  quantity: number;
  strainer: string;
  flexibleConnector: string;
  floatSwitch: string;
  floatSwitchQty: number;
  pressureVessel: string;
  pressureVesselBrand: string;
  pressureVesselCapacity: string;
  pressureVesselRating: string;
  material: string;
  materialQty: number;
  controlPanelType: string;
  controlPanelPower: string;
  controlPanelRelay: string;
  controlPanelADDC: string;
  controlPanelTH: string;
  controlPanelPTC: string;
  controlPanelAV: string;
  controlPanelBYP: string;
  }
  