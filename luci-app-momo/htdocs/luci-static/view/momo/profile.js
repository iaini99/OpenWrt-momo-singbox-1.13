'use strict';
'require form';
'require view';
'require uci';
'require tools.momo as momo';

return view.extend({
    load: function () {
        return Promise.all([
            uci.load('momo'),
            momo.getPaths(),
        ]);
    },
    render: function (data) {
        const paths = data[1];

        let m, s, o, so;

        m = new form.Map('momo');

        s = m.section(form.NamedSection, 'config', 'config', _('Profile'));

        o = s.option(form.FileUpload, '_upload_profile', _('Upload Profile'));
        o.browser = true;
        o.enable_download = true;
        o.root_directory = paths.profiles_dir;
        o.write = function (section_id, formvalue) {
            return true;
        };

        s = m.section(form.GridSection, 'subscription', _('Subscription'));
        s.addremove = true;
        s.anonymous = true;
        s.sortable = true;
        s.modaltitle = _('Edit Subscription');

        o = s.option(form.Value, 'name', _('Subscription Name'));
        o.rmempty = false;

        o = s.option(form.Value, 'used', _('Used'));
        o.modalonly = false;
        o.optional = true;
        o.readonly = true;

        o = s.option(form.Value, 'total', _('Total'));
        o.modalonly = false;
        o.optional = true;
        o.readonly = true;

        o = s.option(form.Value, 'expire', _('Expire At'));
        o.modalonly = false;
        o.optional = true;
        o.readonly = true;

        o = s.option(form.Value, 'update', _('Update At'));
        o.modalonly = false;
        o.optional = true;
        o.readonly = true;

        o = s.option(form.Button, 'update_subscription');
        o.editable = true;
        o.inputstyle = 'positive';
        o.inputtitle = _('Update');
        o.modalonly = false;
        o.onclick = function (_, section_id) {
            return momo.updateSubscription(section_id);
        };

        o = s.option(form.Value, 'info_url', _('Subscription Info Url'));
        o.modalonly = true;

        o = s.option(form.Value, 'url', _('Subscription Url'));
        o.modalonly = true;
        o.rmempty = false;

        o = s.option(form.Value, 'user_agent', _('User Agent'));
        o.default = 'sing-box';
        o.modalonly = true;
        o.rmempty = false;
        o.value('sing-box');

        o = s.option(form.ListValue, 'prefer', _('Prefer'));
        o.default = 'remote';
        o.modalonly = true;
        o.value('remote', _('Remote'));
        o.value('local', _('Local'));

        o = s.option(form.Flag, 'convert', _('Enable Conversion'));
        o.modalonly = true;

        o = s.option(form.Value, 'converter_url', _('Converter URL'));
        o.modalonly = true;
        o.depends('convert', '1');
        o.placeholder = 'https://api.v1.mk/sub';
        o.value('https://api.v1.mk/sub', 'v1.mk');
        o.value('https://sub.d1.mk/sub', 'd1.mk');
        o.value('https://api.tsutsu.one/sub', 'tsutsu.one');

        o = s.option(form.Value, 'template_url', _('Template URL'));
        o.modalonly = true;
        o.depends('convert', '1');
        o.placeholder = 'https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Special/SingBox.ini';
        o.value('https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Special/SingBox.ini', 'ACL4SSR_SingBox');
        o.value('https://raw.githubusercontent.com/yichahucha/config/master/sing-box/template.json', 'yichahucha_SingBox');
        o.value('https://raw.githubusercontent.com/mzyu/sing-box-config/main/template.json', 'mzyu_SingBox');

        return m.render();
    }
});
