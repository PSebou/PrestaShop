/**
 * Copyright since 2007 PrestaShop SA and Contributors
 * PrestaShop is an International Registered Trademark & Property of PrestaShop SA
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Open Software License (OSL 3.0)
 * that is bundled with this package in the file LICENSE.md.
 * It is also available through the world-wide-web at this URL:
 * https://opensource.org/licenses/OSL-3.0
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@prestashop.com so we can send you a copy immediately.
 *
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade PrestaShop to newer
 * versions in the future. If you wish to customize PrestaShop for your
 * needs please refer to https://devdocs.prestashop.com/ for more information.
 *
 * @author    PrestaShop SA and Contributors <contact@prestashop.com>
 * @copyright Since 2007 PrestaShop SA and Contributors
 * @license   https://opensource.org/licenses/OSL-3.0 Open Software License (OSL 3.0)
 */
import $ from 'jquery';

$(document).ready(() => {
  let lastSentEmail = '';

  $('#field-guest-email').on('input', function () {
    const input = $(this);
    let debounceTimeout;
    clearTimeout(debounceTimeout);

    debounceTimeout = setTimeout(() => {
      const email = input.val().trim();

      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (isValidEmail && email !== lastSentEmail) {
        lastSentEmail = email;

        const emailEvent = new CustomEvent('GuestEmailEntered', {
          detail: {
            email,
            timestamp: new Date(),
          },
        });

        window.dispatchEvent(emailEvent);
        console.log('Événement "emailEntered" déclenché avec :', email);
      }
    }, 5000); // délai en ms après la dernière frappe
  });
});

// Exemple de listener pour l'événement
window.addEventListener('GuestEmailEntered', (e) => {
  console.log(e.detail.email);
  const $form = $('#guest-form');

  if ($form.length) {
    console.log('Soumission AJAX du formulaire #guest-form…');

    $.ajax({
      type: $form.attr('method') || 'POST',
      url: $form.attr('action'),
      data: $form.serialize(),
      success(response) {
        console.log('Formulaire soumis avec succès.', response);
      },
      error(xhr, status, error) {
        console.error('Erreur lors de la soumission du formulaire :', error);
      },
    });
  } else {
    console.warn('Formulaire #guest-form introuvable.');
  }
});
