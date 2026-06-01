const demoBuildingImage = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800";
const demoFloorPlanImage = "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800";

export const schoolsDetailedData: any[] = [
  {
    id: 'BLD-035',
    name: 'AMC Primary Marathi Boys School No. 7',
    nameEnglish: 'AMC Primary Marathi Boys School No. 7',
    propertyNumber: 'BLD-035',
    partitionNumber: '1',
    wardNumber: 'Ward 12',
    zoneNumber: 'East Zone',
    ownerID: 'OWN-9941',
    location: 'Nehru Park Road, Akola',
    plotAreaSqFt: 12000,
    builtUpAreaSqFt: 9500,
    carpetAreaSqFt: 8200,
    carpetAreaSqMtr: 762,
    numberOfRooms: 12,
    numberOfFloors: 2,
    totalRooms: 12,
    images: [demoBuildingImage],
    floorPlans: [
      { floorName: 'Ground Floor', image: demoFloorPlanImage }
    ],
    floorSections: [
      { name: 'Classroom 1A', isRegistered: true },
      { name: 'Classroom 1B', isRegistered: true },
      { name: 'Science Lab', isRegistered: true },
      { name: 'Staff Room', isRegistered: true }
    ]
  }
];
