export interface Project {
    id: number;
    projectName: string;
    projectCode: string;
    contractor: string;
    consultant: string;
    location: string;
    revision:number;
    generatedCode:string;
    children: ProjectChild[]; // Array of child data
  }
  
  export interface ProjectChild {
  projectId: number;
  child_id:number;
  flow: string;
  head: string;
  priceMultipler:number;
  assemblerMultipler:number;
  manualCost:number;
  TOTALCOST:number;
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
  needControl:string;
  controlPanelType: string;
  controlPanelPower: string;
  controlPanelRelay: string;
  controlPanelADDC: string;
  controlPanelTH: string;
  controlPanelPTC: string;
  controlPanelAV: string;
  controlPanelBYP: string;
  }
  export interface ProjectData{
    projectName: string;
    generatedCode:string;
    projectCode: string;
    contractor: string;
    consultant: string;
    location: string;
    revision:number;
    parentsysid: number,
    quantity: 0,
    floatswitchQty: 0,
    materailQty: 0,
    price: 0.0,
    sth: 0,
    stp: 0,
    bp: 0,
    fsw: 0,
    ctrlprice: 0.0,
    uvr: 0.0
  }

  export interface ProjectSerch{
    projectName: string;
    projectCode: string;
    contractor: string;
    consultant: string;
    location: string;
  }
  