import {Type} from "class-transformer";

export class LogStats {
  public count: number;

  public usernames: string[];
  public logTypes: string[];
  public classNames: string[];

  @Type(() => Date)
  public minDateTime: Date;

  @Type(() => Date)
  public maxDateTime: Date;

  public minDuration: number;
  public maxDuration: number;
  public minQueryCount: number;
  public maxQueryCount: number;
}
//  @Id
//   private String id;
//
//   @JsonFormat(pattern = GeneralUtil.DATE_TIME_ISO_FORMAT)
//   private LocalDateTime timestamp;
//
//   private String username;
//   private String className;
//   private String methodName;
//   private String arguments;
//   private Long duration;
//   private Long queryCount;
//   private Boolean isException;
//   private String message;
//   private LogType type;