import { IconButton } from "components/icon-button/icon-button";
import { useDevtoolsContext } from "devtools.context";

export const Options = ({ children }: { children: React.ReactNode }) => {
  const { isOnline, setIsOnline } = useDevtoolsContext("DevtoolsOptions");

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",

        borderBottom: "1px solid #3d424a",
        padding: "0px 10px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flex: "1 1 auto",
        }}
      >
        {children}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <IconButton onClick={() => setIsOnline(!isOnline)}>
          <svg
            id="fi_2099239"
            enableBackground="new 0 0 512 512"
            viewBox="0 0 512 512"
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
          >
            <ellipse
              cx="256"
              cy="403.113"
              rx="47.692"
              ry="47.692"
              transform="matrix(.16 -.987 .987 .16 -182.914 591.236)"
              fill={isOnline ? "#1cca39" : "#afb3b9"}
            />

            <path
              fill={isOnline ? "#1cca39" : "#afb3b9"}
              d="m497.765 161.344c-68.729-68.728-157.115-100.149-241.765-100.149s-173.036 31.421-241.765 100.149c-18.994 19.016-18.907 48.462-.177 67.271 23.39 23.65 54.014 14.236 67.727.064 46.554-46.492 108.419-72.096 174.215-72.096s127.661 25.604 174.215 72.096c13.713 14.172 44.337 23.586 67.727-.064 18.73-18.809 18.817-48.255-.177-67.271z"
            />
            <path
              fill={isOnline ? "#1cca39" : "#afb3b9"}
              d="m256 208.303c-47.421 0-98.304 17.63-137.733 57.05-19.237 19.236-18.854 48.818.192 67.663 18.911 18.782 48.334 18.703 67.24-.203 18.778-18.777 43.744-29.118 70.3-29.118s51.522 10.341 70.3 29.118c18.906 18.906 48.33 18.985 67.24.203 19.046-18.845 19.429-48.427.192-67.663-39.427-39.419-90.31-57.05-137.731-57.05z"
            />

            {!isOnline && (
              <path
                stroke="#ed193d"
                strokeWidth="80px"
                d="M 16.894 15.932 L 487.133 485.148"
                transform="matrix(1, 0, 0, 1, 2.842170943040401e-14, 5.684341886080802e-14)"
              />
            )}
          </svg>
        </IconButton>
        <IconButton>
          <svg
            version="1.1"
            id="fi_25442"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="100%"
            height="100%"
            viewBox="0 0 438.529 438.529"
            xmlSpace="preserve"
          >
            <g>
              <path
                fill="#afb3b9"
                d="M436.25,181.438c-1.529-2.002-3.524-3.193-5.995-3.571l-52.249-7.992c-2.854-9.137-6.756-18.461-11.704-27.98
c3.422-4.758,8.559-11.466,15.41-20.129c6.851-8.661,11.703-14.987,14.561-18.986c1.523-2.094,2.279-4.281,2.279-6.567
c0-2.663-0.66-4.755-1.998-6.28c-6.848-9.708-22.552-25.885-47.106-48.536c-2.275-1.903-4.661-2.854-7.132-2.854
c-2.857,0-5.14,0.855-6.854,2.567l-40.539,30.549c-7.806-3.999-16.371-7.52-25.693-10.565l-7.994-52.529
c-0.191-2.474-1.287-4.521-3.285-6.139C255.95,0.806,253.623,0,250.954,0h-63.38c-5.52,0-8.947,2.663-10.278,7.993
c-2.475,9.513-5.236,27.214-8.28,53.1c-8.947,2.86-17.607,6.476-25.981,10.853l-39.399-30.549
c-2.474-1.903-4.948-2.854-7.422-2.854c-4.187,0-13.179,6.804-26.979,20.413c-13.8,13.612-23.169,23.841-28.122,30.69
c-1.714,2.474-2.568,4.664-2.568,6.567c0,2.286,0.95,4.57,2.853,6.851c12.751,15.42,22.936,28.549,30.55,39.403
c-4.759,8.754-8.47,17.511-11.132,26.265l-53.105,7.992c-2.093,0.382-3.9,1.621-5.424,3.715C0.76,182.531,0,184.722,0,187.002
v63.383c0,2.478,0.76,4.709,2.284,6.708c1.524,1.998,3.521,3.195,5.996,3.572l52.25,7.71c2.663,9.325,6.564,18.743,11.704,28.257
c-3.424,4.761-8.563,11.468-15.415,20.129c-6.851,8.665-11.709,14.989-14.561,18.986c-1.525,2.102-2.285,4.285-2.285,6.57
c0,2.471,0.666,4.658,1.997,6.561c7.423,10.284,23.125,26.272,47.109,47.969c2.095,2.094,4.475,3.138,7.137,3.138
c2.857,0,5.236-0.852,7.138-2.563l40.259-30.553c7.808,3.997,16.371,7.519,25.697,10.568l7.993,52.529
c0.193,2.471,1.287,4.518,3.283,6.14c1.997,1.622,4.331,2.423,6.995,2.423h63.38c5.53,0,8.952-2.662,10.287-7.994
c2.471-9.514,5.229-27.213,8.274-53.098c8.946-2.858,17.607-6.476,25.981-10.855l39.402,30.84c2.663,1.712,5.141,2.563,7.42,2.563
c4.186,0,13.131-6.752,26.833-20.27c13.709-13.511,23.13-23.79,28.264-30.837c1.711-1.902,2.569-4.09,2.569-6.561
c0-2.478-0.947-4.862-2.857-7.139c-13.698-16.754-23.883-29.882-30.546-39.402c3.806-7.043,7.519-15.701,11.136-25.98l52.817-7.988
c2.279-0.383,4.189-1.622,5.708-3.716c1.523-2.098,2.279-4.288,2.279-6.571v-63.376
C438.533,185.671,437.777,183.438,436.25,181.438z M270.946,270.939c-14.271,14.277-31.497,21.416-51.676,21.416
c-20.177,0-37.401-7.139-51.678-21.416c-14.272-14.271-21.411-31.498-21.411-51.673c0-20.177,7.135-37.401,21.411-51.678
c14.277-14.272,31.504-21.411,51.678-21.411c20.179,0,37.406,7.139,51.676,21.411c14.274,14.277,21.413,31.501,21.413,51.678
C292.359,239.441,285.221,256.669,270.946,270.939z"
              />
            </g>
          </svg>
        </IconButton>
      </div>
    </div>
  );
};
