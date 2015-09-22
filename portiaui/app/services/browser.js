import Ember from 'ember';


export const DEFAULT_MODE = 'navigation';
export const ANNOTATION_MODE = 'annotation';
export const INTERACTION_MODES = new Set([ANNOTATION_MODE]);

export default Ember.Service.extend({
    backBuffer: [],
    disabled: true,
    document: null,
    forwardBuffer: [],
    loading: false,
    mode: DEFAULT_MODE,
    _url: null,

    isInteractionMode: Ember.computed('mode', function() {
        return INTERACTION_MODES.has(this.get('mode'));
    }),
    url: Ember.computed('_url', {
        get() {
            return this.get('_url');
        },

        set(key, value) {
            this.go(value);
            return value;
        }
    }),
    $document: Ember.computed('document', function() {
        const document = this.get('document');
        return document ? Ember.$(document) : null;
    }),

    go(url) {
        const currentUrl = this.get('_url');
        if (url && url !== currentUrl) {
            this.beginPropertyChanges();
            if (currentUrl) {
                this.get('backBuffer').pushObject(currentUrl);
            }
            this.set('_url', url);
            this.set('forwardBuffer', []);
            this.endPropertyChanges();
        }
    },

    back() {
        if (this.get('backBuffer.length')) {
            this.beginPropertyChanges();
            this.get('forwardBuffer').pushObject(this.get('_url'));
            this.set('_url', this.get('backBuffer').popObject());
            this.endPropertyChanges();
        }
    },

    forward() {
        if (this.get('forwardBuffer.length')) {
            this.beginPropertyChanges();
            this.get('backBuffer').pushObject(this.get('_url'));
            this.set('_url', this.get('forwardBuffer').popObject());
            this.endPropertyChanges();
        }
    },

    reload() {
    },

    setAnnotationMode() {
        this.set('mode', ANNOTATION_MODE);
    },

    clearAnnotationMode() {
        if (this.get('mode') === ANNOTATION_MODE) {
            this.set('mode', DEFAULT_MODE);
        }
    }
});
