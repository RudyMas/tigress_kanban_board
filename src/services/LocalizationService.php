<?php

namespace Service;

/**
 * Class LocalizationService
 *
 * @author Rudy Mas <rudy.mas@rudymas.be>
 * @copyright 2025 Rudy Mas (https://rudymas.be)
 * @license https://opensource.org/licenses/GPL-3.0 GNU General Public License, version 3 (GPL-3.0)
 * @version 2025.06.26.0
 * @package Service\LocalizationService
 */
class LocalizationService
{
    /**
     * Get the available statuses in the specified language.
     * This method returns an array of status strings
     * with keys corresponding to their status codes.
     * The default language is English ('en').
     *
     * @param string $lang
     * @return string[]
     */
    public static function getStatuses(string $lang = 'en'): array
    {
        return [
            0 => __('Not started'),
            1 => __('In preparation'),
            2 => __('Developing'),
            3 => __('Testing'),
            4 => __('Done'),
            5 => __('On hold'),
        ];
    }

    /**
     * Get the available priorities in the specified language.
     * This method returns an array of priority strings
     * with keys corresponding to their priority levels.
     * The default language is English ('en').
     *
     * @param string $lang
     * @return string[]
     */
    public static function getPriorities(string $lang = 'en'): array
    {
        return [
            1 => __('Critical') . ' (' . __('ASAP') . ')',
            2 => __('High'),
            3 => __('Medium-High'),
            4 => __('Medium'),
            5 => __('Medium-Low'),
            6 => __('Low'),
            7 => __('Very Low'),
            8 => __('Optional'),
            9 => __('None'),
        ];
    }
}