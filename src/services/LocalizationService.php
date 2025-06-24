<?php

namespace Service;

/**
 * Class LocalizationService
 *
 * @author Rudy Mas <rudy.mas@rudymas.be>
 * @copyright 2025 Rudy Mas (https://rudymas.be)
 * @license https://opensource.org/licenses/GPL-3.0 GNU General Public License, version 3 (GPL-3.0)
 * @version 2025.06.24.1
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
        $statuses = [
            'en' => [
                0 => 'Not started',
                1 => 'In preparation',
                2 => 'Developing',
                3 => 'Testing',
                4 => 'Done',
                5 => 'On hold',
            ],
            'nl' => [
                0 => 'Niet gestart',
                1 => 'In voorbereiding',
                2 => 'In ontwikkeling',
                3 => 'In test',
                4 => 'Klaar',
                5 => 'In afwachting',
            ],
            'fr' => [
                0 => 'Non commencé',
                1 => 'En préparation',
                2 => 'En développement',
                3 => 'En test',
                4 => 'Terminé',
                5 => 'En attente',
            ],
            'de' => [
                0 => 'Nicht gestartet',
                1 => 'In Vorbereitung',
                2 => 'In Entwicklung',
                3 => 'In Test',
                4 => 'Fertig',
                5 => 'In Wartestellung',
            ],
            'es' => [
                0 => 'No iniciado',
                1 => 'En preparación',
                2 => 'En desarrollo',
                3 => 'En prueba',
                4 => 'Hecho',
                5 => 'En espera',
            ],
            'it' => [
                0 => 'Non iniziato',
                1 => 'In preparazione',
                2 => 'In sviluppo',
                3 => 'In prova',
                4 => 'Fatto',
                5 => 'In attesa',
            ],
        ];
        return $statuses[$lang] ?? $statuses['en'];
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
        $priorities = [
            'en' => [
                1 => 'Critical (ASAP)',
                2 => 'High',
                3 => 'Medium-High',
                4 => 'Medium',
                5 => 'Medium-Low',
                6 => 'Low',
                7 => 'Very Low',
                8 => 'Optional',
                9 => 'None',
            ],
            'nl' => [
                1 => 'Kritisch (ASAP)',
                2 => 'Hoog',
                3 => 'Medium-Hoog',
                4 => 'Medium',
                5 => 'Medium-Laag',
                6 => 'Laag',
                7 => 'Zeer Laag',
                8 => 'Optioneel',
                9 => 'Geen',
            ],
            'fr' => [
                1 => 'Critique (ASAP)',
                2 => 'Haut',
                3 => 'Moyen-Haut',
                4 => 'Moyen',
                5 => 'Moyen-Bas',
                6 => 'Bas',
                7 => 'Très Bas',
                8 => 'Optionnel',
                9 => 'Aucun',
            ],
            'de' => [
                1 => 'Kritisch (ASAP)',
                2 => 'Hoch',
                3 => 'Mittel-Hoch',
                4 => 'Mittel',
                5 => 'Mittel-Niedrig',
                6 => 'Niedrig',
                7 => 'Sehr Niedrig',
                8 => 'Optional',
                9 => 'Keine',
            ],
            'es' => [
                1 => 'Crítico (ASAP)',
                2 => 'Alto',
                3 => 'Medio-Alto',
                4 => 'Medio',
                5 => 'Medio-Bajo',
                6 => 'Bajo',
                7 => 'Muy Bajo',
                8 => 'Opcional',
                9 => 'Ninguno',
            ],
            'it' => [
                1 => 'Critico (ASAP)',
                2 => 'Alto',
                3 => 'Medio-Alto',
                4 => 'Medio',
                5 => 'Medio-Basso',
                6 => 'Basso',
                7 => 'Molto Basso',
                8 => 'Opzionale',
                9 => 'Nessuno',
            ],
        ];
        return $priorities[$lang] ?? $priorities['en'];
    }
}