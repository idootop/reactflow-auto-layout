export const kBaseMarkerColor = '#000000';
export const kYesMarkerColor = '#64ba5e';
export const kNoMarkerColor = '#ff0000';
export const kBaseMarkerColors = ['#9b5de5', '#ff758f', '#ff9f1c', '#3579f6'];
export const kAllMarkerColors = [
  kBaseMarkerColor,
  kYesMarkerColor,
  ...kBaseMarkerColors,
];

export const ColorfulMarkerDefinitions = () => {
  return (
    <svg style={{ position: 'absolute', top: 0, left: 0 }}>
      <defs>
        {kAllMarkerColors.map((color) => (
          <Marker color={color} id={color.replace('#', '')} key={color} />
        ))}
      </defs>
    </svg>
  );
};

const Marker = ({
  id,
  color,
  strokeWidth = 1,
  width = 12.5,
  height = 12.5,
  markerUnits = 'strokeWidth',
  orient = 'auto-start-reverse',
}: any) => {
  return (
    <marker
      id={id}
      markerHeight={`${height}`}
      markerUnits={markerUnits}
      markerWidth={`${width}`}
      orient={orient}
      refX="0"
      refY="0"
      viewBox="-10 -10 20 20"
    >
      <polyline
        points="-5,-4 0,0 -5,4 -5,-4"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          stroke: color,
          fill: color,
          strokeWidth,
        }}
      />
    </marker>
  );
};
