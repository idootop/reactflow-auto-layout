export const kBaseMarkerColor = "#000000";
export const kYesMarkerColor = "#64ba5e";
export const kNoMarkerColor = "#ff0000";
export const kBaseMarkerColors = ["#9b5de5", "#ff758f", "#ff9f1c", "#3579f6"];
export const kAllMarkerColors = [
  kBaseMarkerColor,
  kYesMarkerColor,
  ...kBaseMarkerColors,
];

export const ColorfulMarkerDefinitions = () => {
  return (
    <svg style={{ position: "absolute", top: 0, left: 0 }}>
      <defs>
        {kAllMarkerColors.map((color) => (
          <Marker key={color} id={color.replace("#", "")} color={color} />
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
  markerUnits = "strokeWidth",
  orient = "auto-start-reverse",
}: any) => {
  return (
    <marker
      id={id}
      markerWidth={`${width}`}
      markerHeight={`${height}`}
      viewBox="-10 -10 20 20"
      markerUnits={markerUnits}
      orient={orient}
      refX="0"
      refY="0"
    >
      <polyline
        style={{
          stroke: color,
          fill: color,
          strokeWidth,
        }}
        strokeLinecap="round"
        strokeLinejoin="round"
        points="-5,-4 0,0 -5,4 -5,-4"
      />
    </marker>
  );
};
