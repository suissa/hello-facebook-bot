const s = require('../settings');
const mu = require('../utils/monitutils');

const isValidValue = (config, value) => {
    return (config in s.configs && (s.configs[config].vals.filter((v) => { return value == v }).length > 0));
};

const getAvailableConfigs = () => {
    let result = '';
    for (c in s.configs) {
        result += '*' + c + ':*\n';
        result += 'Valores:';
        s.configs[c].vals.forEach((v) => {
            result += ' `' + v + '`,';
        });
        result = result.slice(0, -1);
        result += '\nPadrão: `' + s.configs[c].default + '`\n\n';
    }
    return result;
};

const configNotFound = (cbk) => {
    cbk({ text: 'Acho que você não entendeu o esquema. A sintaxe correta é: `config [nome da config] (valor|clear)`\n\nConfigs disponíveis:\n' + getAvailableConfigs() });
}

const sendError = (cbk) => {
    cbk({ texT: "Erro ao redefinir a config" });
    //mu.notifySharedAccount(bot, 'Erro no módulo config: `' + JSON.stringify(err || data) + '`');
}

const execute = (args, cbk) => {
    let match = args.match;
    if (match[2]) {
        if (match[2] == 'clear') {
            if (match[1] in s.configs) {
                s.clear(args.id, match[1], (err, data) => {
                    if (data.result.ok && !err) {
                        cbk({ text: "Config `" + match[1] + "` redefinida" });
                    } else {
                        sendError(cbk);
                    }
                });
            } else {
                configNotFound(cbk);
            }
        } else {
            if (match[1] in s.configs && isValidValue(match[1], match[2])) {
                s.set(args.id, match[1], match[2], (err, data) => {
                    if (err) {
                        sendError(cbk);
                    } else {
                        if (data.key = match[1]) {
                            cbk({ text: "Config `" + match[1] + "` definida para `" + match[2] + "`" });
                        }
                    }
                });
            } else {
                configNotFound(cbk);
            }
        }
    } else {
        if (match[1] == 'clear') {
            s.clear(args.id, false, (err, data) => {
                if (data.result.ok) {
                    cbk({ text: "Configurações redefinidas" });
                } else {
                    sendError(cbk);
                }
            });
        } else if (match[1] in s.configs) {
            s.get(args.id, match[1], (err, data) => {
                if (err) {
                    sendError(cbk);
                } else {
                    cbk({ text: "Valor da config `" + match[1] + "`: `" + data + "`" })
                }
            });
        } else {
            configNotFound(cbk);
        }
    }
};

module.exports = {
    execute,
    getAvailableConfigs
}