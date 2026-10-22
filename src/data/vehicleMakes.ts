/**
 * Vehicles supported for Nigerian motor quotes.
 *
 * Auto.dev has a global catalogue, so its response is always filtered through
 * this list before it reaches the browser. Keep this list aligned with the
 * vehicles the quote partners can insure in Nigeria.
 */
export const NIGERIA_VEHICLE_CATALOG = {
  Acura: ['MDX', 'RDX', 'TL', 'TLX'],
  Audi: ['A3', 'A4', 'A6', 'Q3', 'Q5', 'Q7'],
  BMW: ['3 Series', '5 Series', '7 Series', 'X1', 'X3', 'X5', 'X6'],
  Chevrolet: ['Aveo', 'Cruze', 'Equinox', 'Tahoe', 'Trailblazer'],
  Ford: ['Edge', 'Escape', 'Explorer', 'F-150', 'Focus', 'Ranger'],
  Honda: ['Accord', 'City', 'Civic', 'CR-V', 'HR-V', 'Odyssey', 'Pilot'],
  Hyundai: ['Accent', 'Creta', 'Elantra', 'Santa Fe', 'Sonata', 'Tucson'],
  Infiniti: ['FX', 'Q50', 'QX50', 'QX60', 'QX80'],
  Innoson: ['IVM Caris', 'IVM G40', 'IVM G80', 'IVM Ikenga', 'IVM Uzo'],
  Jeep: ['Cherokee', 'Compass', 'Grand Cherokee', 'Wrangler'],
  Kia: ['Cerato', 'K5', 'Optima', 'Picanto', 'Rio', 'Sorento', 'Sportage'],
  'Land Rover': ['Defender', 'Discovery', 'Discovery Sport', 'Range Rover', 'Range Rover Evoque', 'Range Rover Sport', 'Range Rover Velar'],
  Lexus: ['ES', 'GS', 'GX', 'IS', 'LX', 'NX', 'RX'],
  Mazda: ['3', '6', 'CX-3', 'CX-5', 'CX-9'],
  'Mercedes-Benz': ['A-Class', 'C-Class', 'E-Class', 'G-Class', 'GLA', 'GLC', 'GLE', 'GLS', 'S-Class'],
  Mitsubishi: ['ASX', 'L200', 'Montero', 'Outlander', 'Pajero'],
  Nissan: ['Almera', 'Altima', 'Frontier', 'Juke', 'Murano', 'Navara', 'Pathfinder', 'Patrol', 'Qashqai', 'Sentra', 'X-Trail'],
  Peugeot: ['301', '3008', '308', '508', '5008', 'Landtrek'],
  Renault: ['Duster', 'Koleos', 'Kwid', 'Logan'],
  Subaru: ['Forester', 'Impreza', 'Legacy', 'Outback', 'XV'],
  Suzuki: ['Baleno', 'Celerio', 'Dzire', 'Ertiga', 'Jimny', 'S-Presso', 'Swift', 'Vitara'],
  Toyota: ['4Runner', 'Avalon', 'Avanza', 'Camry', 'Corolla', 'Fortuner', 'Hiace', 'Highlander', 'Hilux', 'Land Cruiser', 'Prado', 'RAV4', 'Sienna', 'Venza', 'Yaris'],
  Volkswagen: ['Amarok', 'Golf', 'Jetta', 'Passat', 'Polo', 'Tiguan', 'Touareg'],
  Volvo: ['S60', 'S90', 'XC40', 'XC60', 'XC90'],
} as const

export type NigeriaVehicleMake = keyof typeof NIGERIA_VEHICLE_CATALOG

export const VEHICLE_SUGGESTIONS = Object.entries(NIGERIA_VEHICLE_CATALOG)
  .flatMap(([make, models]) => models.map((model) => `${make} ${model}`))
