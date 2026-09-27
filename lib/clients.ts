/**
 * Client marks, supplied by the clients themselves.
 *
 * Shared by the home page hero and the company profile so the two never claim
 * a different set. `height` is per logo on purpose: a row matches on cap
 * height, not box height, so the two square marks stand taller than the
 * Rongobuy wordmark, which is kept at its native 161x36 rather than upscaled.
 *
 * Only add a mark here with the client's permission to display it.
 */
export type ClientMark = {
  name: string;
  src: string;
  width: number;
  height: number;
  /** Cap-height match for the hero's inline row. */
  rowClassName: string;
};

export const CLIENTS: ClientMark[] = [
  {
    name: "Signature Bangla",
    src: "/images/clients/signature-bangla.png",
    width: 120,
    height: 120,
    rowClassName: "h-[30px]",
  },
  {
    name: "Textalyz AI",
    src: "/images/clients/textalyz-ai.png",
    width: 120,
    height: 120,
    rowClassName: "h-[30px]",
  },
  {
    name: "Rongobuy",
    src: "/images/clients/rongobuy.png",
    width: 161,
    height: 36,
    rowClassName: "h-[18px]",
  },
];
