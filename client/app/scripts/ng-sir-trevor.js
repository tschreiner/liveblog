import angular from 'angular';

export default angular
    .module('SirTrevor', [])
    .provider('SirTrevor', function() {
        this.$get = function() {
            return window.SirTrevor;
        };
        angular.extend(this, window.SirTrevor);
    })
    .provider('SirTrevorOptions', function() {
        var options = {
            blockTypes: ['Text'],
            transform: {
                get: function(block) {
                    return {
                        type: block.blockStorage.type,
                        data: block.blockStorage.data
                    };
                },
                set: function(block) {
                    return {
                        type: block.type,
                        data: block.data
                    };
                }
            }
        };

        this.$get = function() {
            return options;
        };
        this.$extend = function(opts) {
            angular.extend(options, opts);
        };
        this.$set = function(opts) {
            options = opts;
        };
    })
    .directive('ngSirTrevor', ['SirTrevor', 'SirTrevorOptions', function(SirTrevor, options) {
        var directive = {
            template: function(element, attr) {
                var str = '<textarea class="sir-trevor" name="content"></textarea>';
                // sir trevor needs a parent `form` tag.

                if (!element.parent('form').length) {
                    str = '<form>' + str + '</form>';
                }
                return str;
            },
            scope: {
                editor: '=stModel',
                onChange: '=stChange',
                params: '=stParams'
            },
            link: function(scope, element, attrs) {
                var opts = angular.copy(options);

                angular.extend(opts, scope.params);
                opts.el = $(element.find('textarea'));
                // opts.textFormatting = {
                //     bold: true,
                //     italic: true,
                //     underline: true,
                //     strikethrough: true,
                //     link: true,
                //     h1: true,
                //     h2: true,
                //     list: true,
                //     blockquote: true,
                //     configure: function(scribe, scribeConfiguration) {
                //         scribeConfiguration.formatBarCommands.push({
                //             name: 'Superscript',
                //             cmd: 'superscript',
                //             text: '^',
                //             title: 'superscript'
                //         });
                //         scribeConfiguration.sanitize.sup = {};
                //         scribeConfiguration.shortcuts.superscript = function(event) {
                //             return (event.metaKey || event.ctrlKey) && event.keyCode === 80; // p
                //         };
                //     }
                // };
                // opts.formatBar = {
                //     commands: [
                //         {
                //             name: "Bold",
                //             title: "bold",
                //             cmd: "bold",
                //             keyCode: 66,
                //             text: "B"
                //         },
                //         {
                //             name: "Italic",
                //             title: "italic",
                //             cmd: "italic",
                //             keyCode: 73,
                //             text: "i"
                //         },
                //         {
                //             name: "Underline",
                //             title: "underline",
                //             cmd: "underline",
                //             text: "U"
                //         },
                //         {
                //             name: "StrikeThrough",
                //             title: "strikethrough",
                //             cmd: "strikeThrough",
                //             text: "S"
                //         },
                //         {
                //             name: "Link",
                //             title: "link",
                //             iconName: "link",
                //             cmd: "linkPrompt",
                //             text: "link"
                //         },
                //         {
                //             name: "Unlink",
                //             title: "unlink",
                //             iconName: "link",
                //             cmd: "unlink",
                //             text: "link"
                //         },
                //         {
                //             name: "Alignleft",
                //             title: "align-left",
                //             iconName: "left-align",
                //             cmd: "alignleft",
                //             text: "Left"
                //           },
                //           {
                //             name: "Aligncenter",
                //             title: "align-center",
                //             iconName: "center-align",
                //             cmd: "aligncenter",
                //             text: "Center"
                //           },
                //           {
                //             name: "Alignright",
                //             title: "align-right",
                //             iconName: "right-align",
                //             cmd: "alignright",
                //             text: "Right"
                //           },
                //     ]
                // };
                scope.editor = new SirTrevor.Editor(opts);
                scope.editor.get = function() {
                    var list = [];
                    // sort blocks by index.

                    scope.editor.block_manager.blocks.sort((a, b) => a.$el.index() - b.$el.index());
                    angular.forEach(scope.editor.block_manager.blocks, (block) => {
                        // scope.editor.saveBlockStateToStore(block);
                        var blockData = block.getData();

                        scope.editor.store.addData(blockData);
                        list.push(opts.transform.get(block));
                    });
                    return list;
                };
                scope.editor.set = function(list) {
                    var item;

                    angular.forEach(list, (block) => {
                        item = opts.transform.set(block);
                        scope.editor.block_manager.createBlock(item.type, item.data);
                    });
                };

                scope.editor.clear = function() {
                    angular.forEach(scope.editor.block_manager.blocks, (block) => {
                        block.remove();
                    });
                    // scope.editor.dataStore.data = [];
                    scope.editor.store.retrieve().data = [];
                };

                element.on('keyup', scope.onChange);

                // @TODO: investigate how to better `digest` out of $scope  variables.
                // scope.$watchCollection('editor.blocks', function(blocks) {
                //     var list = [];
                //     _.each(blocks, function(block) {
                //         list.push(scope.editor.get(block));
                //     });
                //     scope.model = list;
                // });
            }
        };

        return directive;
    }]);


