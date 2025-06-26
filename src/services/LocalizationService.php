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
        $lang = substr($lang, 0, 2);
        $file = SYSTEM_ROOT . '/vendor/tigress/core/translations/base_' . $lang . '.json';
        if (!file_exists($file)) {
            $file = SYSTEM_ROOT . '/vendor/tigress/core/translations/base_en.json';
        }
        $translationsFile = json_decode(file_get_contents($file), true);

        return [
            0 => $translationsFile[$lang]['not_started'] ?? 'Not started',
            1 => $translationsFile[$lang]['in_preparation'] ?? 'In preparation',
            2 => $translationsFile[$lang]['developing'] ?? 'Developing',
            3 => $translationsFile[$lang]['testing'] ?? 'Testing',
            4 => $translationsFile[$lang]['done'] ?? 'Done',
            5 => $translationsFile[$lang]['on_hold'] ?? 'On hold',
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
        $lang = substr($lang, 0, 2);
        $file = SYSTEM_ROOT . '/vendor/tigress/core/translations/base_' . $lang . '.json';
        if (!file_exists($file)) {
            $file = SYSTEM_ROOT . '/vendor/tigress/core/translations/base_en.json';
        }
        $translationsFile = json_decode(file_get_contents($file), true);

        return [
            1 => ($translationsFile[$lang]['critical'] ?? 'Critical') . ' ' . ($translationsFile[$lang]['asap_abr'] ?? '(ASAP)'),
            2 => $translationsFile[$lang]['high'] ?? 'High',
            3 => $translationsFile[$lang]['medium_high'] ?? 'Medium-High',
            4 => $translationsFile[$lang]['medium'] ?? 'Medium',
            5 => $translationsFile[$lang]['medium_low'] ?? 'Medium-Low',
            6 => $translationsFile[$lang]['low'] ?? 'Low',
            7 => $translationsFile[$lang]['very_low'] ?? 'Very Low',
            8 => $translationsFile[$lang]['optional'] ?? 'Optional',
            9 => $translationsFile[$lang]['none'] ?? 'None',
        ];
    }
}