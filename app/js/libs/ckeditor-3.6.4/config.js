/*
Copyright (c) 2003-2012, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.editorConfig = function( config )
{
	// Define changes to default configuration here. For example:
	// config.language = 'fr';
	// config.uiColor = '#AADC6E';
	
    config.toolbar = [
                ['CreatePlaceholder'],
                [      'Undo', 'Redo',
                  '-', 'Bold', 'Italic', 'Underline',
                  '-', 'Link', 'Unlink',
                  '-', 'Format',
                ],
                [      'HorizontalRule',
                  '-', 'Table',
                  '-', 'BulletedList', 'NumberedList',
                  '-', 'SpecialChar','Smiley',
                  '-', 'Source','Maximize'
                ]
            ];
    config.extraPlugins = 'placeholder';
    config.skin = 'BootstrapCK-Skin';
    config.startupShowBorders=false;
};
