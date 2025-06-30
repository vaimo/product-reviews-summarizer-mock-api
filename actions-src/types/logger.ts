/**
 * Copyright © Vaimo Group. All rights reserved.
 * See LICENSE.txt for license details.
 */
export interface Logger {
  debug: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}