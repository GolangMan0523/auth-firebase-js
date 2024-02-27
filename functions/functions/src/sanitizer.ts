/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import Filter from 'bad-words';

const badWordsFilter = new Filter();

/**
 * Capitalizes the first letter of each sentence in the given input.
 *
 * @param {string} input The input string.
 * @return {string} The capitalized string.
 */
function capitalizeSentence(input: string): string {
  const regexp = /(:?\.\s?|^)([A-Za-z\u00C0-\u1FFF\u2800-\uFFFD])/gi;
  return input.replace(regexp, (match) => match.toUpperCase());
}

// Sanitizes the given text if needed by replacing bad words with '*'.
export const sanitizeText = (text: string) => {
  // Re-capitalize if the user is Shouting.
  if (isShouting(text)) {
    console.log('User is shouting. Fixing sentence case...');
    text = stopShouting(text);
  }

  // Moderate if the user uses SwearWords.
  if (containsSwearwords(text)) {
    console.log('User is swearing. moderating...');
    text = replaceSwearwords(text);
  }

  return text;
};

/**
 * Checks if the given message contains swearwords.
 *
 * @param {string} message
 * @return {boolean} True if the message contains swearwords.
 */
function containsSwearwords(message: string): boolean {
  return message !== badWordsFilter.clean(message);
}

/**
 * Hide all swearwords. e.g: Crap => ****.
 *
 * @param {string} message
 * @return {string} The sanitized message.
 */
function replaceSwearwords(message: string): string {
  return badWordsFilter.clean(message);
}

/**
 * Detect if the current message is shouting. i.e. there are too many Uppercase
 * characters or exclamation points.
 *
 * @param {string} message
 * @return {boolean} True if the message is shouting.
 */
function isShouting(message: string): boolean {
  return (
    message.replace(/[^A-Z]/g, '').length > message.length / 2 ||
    message.replace(/[^!]/g, '').length >= 3
  );
}

/**
 * Correctly capitalize the string as a sentence (e.g. uppercase after dots)
 * and remove exclamation points.
 *
 * @param {string} message
 * @return {string} The sanitized message.
 */
function stopShouting(message: string): string {
  return capitalizeSentence(message.toLowerCase()).replace(/!+/g, '.');
}
