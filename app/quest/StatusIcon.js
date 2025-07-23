const StatusIcon = ({ color = "#F1C315" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    <path
      d="M7 3V4H6V5H5V6H4V7H3V8H4V9H5V10H6V11H7V12H9V11H10V10H11V9H12V8H13V7H12V6H11V5H10V4H9V3H7ZM11 4H12V5H13V6H14V7H15V8H14V9H13V10H12V11H11V12H10V13H9V14H7V13H6V12H5V11H4V10H3V9H2V8H1V7H2V6H3V5H4V4H5V3H6V2H7V1H9V2H10V3H11V4Z"
      fill={color}
    />
    <rect x="7" y="5" width="2" height="1" fill={color} />
    <rect x="7" y="9" width="2" height="1" fill={color} />
    <rect x="6" y="6" width="4" height="1" fill={color} />
    <rect x="6" y="8" width="4" height="1" fill={color} />
    <rect x="5" y="7" width="6" height="1" fill={color} />
  </svg>
);

export default StatusIcon;
