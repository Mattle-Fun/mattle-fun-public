export const hashString = (str) => {
  let hash = 0;
  for (let i = 0; i < str?.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
};
const TokenLogo = ({ imageHref, size = 20 }) => {
  const idSuffix = hashString(imageHref);
  const patternId = `pattern_${size}_${idSuffix}`;
  const imageId = `image_${size}_${idSuffix}`;

  let d =
    "M5.41667 0H14.5833V1.25H17.5V2.5H18.75V5H20V14.5833H18.75V17.0833H17.5V18.3333H14.5833V20H5.41667V18.3334H2.5V17.0834H1.25V14.5834H0V5.00005H1.25V2.50005H2.5V1.25005H5.41667V0Z";
  switch (size) {
    case 32:
      d =
        "M8.66667 0H23.3333V2H28V4H30V8H32V23.3333H30V27.3333H28V29.3333H23.3333V32H8.66667V29.3334H4V27.3334H2V23.3334H0V8.00009H2V4.00008H4V2.00008H8.66667V0Z";
      break;
    case 48:
      d =
        "M13 0H35V3H42V6H45V12H48V35H45V41H42V44H35V48H13V44.0001H6V41.0001H3V35.0001H0V12.0001H3V6.00013H6V3.00013H13V0Z";
      break;
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d={d} fill={`url(#${patternId})`} />
      <defs>
        <pattern
          id={patternId}
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use href={`#${imageId}`} transform="scale(0.005)" />
        </pattern>
        <image
          id={imageId}
          width="200"
          height="200"
          preserveAspectRatio="none"
          href={imageHref}
        />
      </defs>
    </svg>
  );
};
export const TokenLogo20 = ({ imageHref }) => {
  return <TokenLogo imageHref={imageHref} size={20} />;
};

export const TokenLogo32 = ({ imageHref }) => {
  return <TokenLogo imageHref={imageHref} size={32} />;
};

export const TokenLogo48 = ({ imageHref }) => {
  return <TokenLogo imageHref={imageHref} size={48} />;
};
