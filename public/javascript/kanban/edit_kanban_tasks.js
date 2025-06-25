document.addEventListener('DOMContentLoaded', function () {
    let script_upload_image = '/public/scripts/tinymce_upload_image.php?folder=kanban';
    let script_list_images = '/public/scripts/tinymce_list_images.php?folder=kanban';
    let img_path = '/public/images/tinymce/kanban/';

    tinymce.init({
        license_key: 'gpl',
        selector: 'textarea',
        promotion: false,
        theme: 'silver',
        language_url: '/node_modules/tinymce-i18n/langs7/nl_BE.js',
        language: 'nl_BE',
        paste_data_images: true,
        height: 300,
        plugins: ['lists', 'code', 'image', 'link'],
        toolbar: "bullist numlist fontfamily fontsize bold italic underline forecolor insertfile image link code",
        images_upload_url: script_upload_image,
        file_picker_callback: function (callback, value, meta) {
            if (meta.filetype === 'image') {
                let dialog = document.createElement('div');
                dialog.style.position = 'fixed';
                dialog.style.left = '50%';
                dialog.style.top = '50%';
                dialog.style.transform = 'translate(-50%, -50%)';
                dialog.style.border = '1px solid #ccc';
                dialog.style.padding = '10px';
                dialog.style.zIndex = '10001';
                dialog.style.backgroundColor = 'white';
                dialog.style.maxWidth = '80%';
                dialog.style.maxHeight = '80%';
                dialog.style.overflow = 'auto';

                let top = document.createElement('div');
                let bottom = document.createElement('div');
                bottom.style.textAlign = 'center';
                dialog.appendChild(top);
                dialog.appendChild(bottom);

                let xhr = new XMLHttpRequest();
                xhr.open('GET', script_list_images, true);
                xhr.responseType = 'json';
                xhr.onload = function () {
                    let images = xhr.response;
                    Object.values(images).forEach(function (image) {
                        let img = document.createElement('img');
                        img.src = img_path + image;
                        img.style.width = '100px';
                        img.style.margin = '10px';
                        img.style.cursor = 'pointer';
                        img.onclick = function () {
                            callback(img.src, {alt: image});
                            document.body.removeChild(dialog);
                        };
                        top.appendChild(img);
                    });
                };
                xhr.send();

                let closeButton = document.createElement('button');
                closeButton.textContent = 'Sluiten';
                closeButton.onclick = function () {
                    document.body.removeChild(dialog);
                };
                bottom.appendChild(closeButton);

                document.body.appendChild(dialog);
            }
        }
    });
});