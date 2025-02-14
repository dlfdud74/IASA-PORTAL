import * as React from 'react'
import { TextField } from '@rmwc/textfield'
import { Button } from '@rmwc/button'
import { Icon } from '@rmwc/icon'
import { Menu, MenuSurfaceAnchor, MenuItem } from '@rmwc/menu'
import { Permission } from '../../scheme/api/auth'

interface IProps {
    setState: any
    isMobile: boolean
    context: any
}

interface IdFormProps extends IProps {
    next?: any
    find?: any
    create?: any
}

interface PasswordFormProps extends IProps {
    next: any
    find: any
}

interface IdFormState {
    id: string
    showSignupMenu: boolean
}

interface PasswordFormState {
    password: string
}

export class IdForm extends React.Component<IdFormProps, IdFormState> {
    firstInput: any

    public componentDidMount() {
        window.addEventListener('loginStateUpdate', () => {
            this.forceUpdate()
        })
        window.addEventListener('focusFrame', (e: CustomEvent) => {
            if (e.detail.frame === 'IdForm') this.firstInput.focus()
        })
    }

    public handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ id: e.target.value })
        this.props.context.set('id', e.target.value.trim().toLowerCase())
    }

    public render() {
        let errS = this.props.context.get('errMessage')
        let errMessage = errS ? (
            <>
                <div
                    style={{
                        color: '#ff5959',
                        clear: 'both',
                        display: 'flex',
                        justifyContent: 'center',
                        margin: '20px',
                    }}>
                    <Icon icon={{ icon: 'error_outline', size: 'xsmall' }} />
                    <span style={{ padding: '3px' }}>{errS}</span>
                </div>
            </>
        ) : (
            <></>
        )
        return (
            <div
                style={{
                    width: this.props.isMobile ? 'calc(100vw - 60px)' : '380px',
                    padding: `5px ${this.props.isMobile ? 30 : 60}px`,
                    float: 'left',
                }}>
                <TextField
                    style={{ width: '100%' }}
                    outlined
                    label='아이디'
                    disabled={!this.props.context.get('loaded')}
                    value={this.state?.id}
                    onChange={this.handleChange.bind(this)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') this.props.next()
                    }}
                    invalid={!!errS}
                    name='id'
                    ref={(input) => {
                        this.firstInput = input
                    }}
                />
                <br />
                {errMessage}
                <div
                    style={{
                        clear: 'both',
                        marginTop: '20px',
                        marginBottom: '20px',
                    }}>
                    <Button
                        style={{ float: 'left' }}
                        onClick={this.props.find}
                        disabled={!this.props.context.get('loaded')}>
                        아이디를 잊으셨나요?
                    </Button>
                </div>
                <br />
                <div
                    style={{
                        clear: 'both',
                        marginTop: '30px',
                        marginBottom: '30px',
                    }}>
                    <MenuSurfaceAnchor>
                        <Menu
                            open={this.state?.showSignupMenu}
                            onClose={() => {
                                this.setState({ showSignupMenu: false })
                            }}>
                            <MenuItem
                                onClick={() => {
                                    this.props.context.set(
                                        'signupType',
                                        Permission.student
                                    )
                                    this.props.create()
                                }}>
                                학생
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    this.props.context.set(
                                        'signupType',
                                        Permission.teacher
                                    )
                                    this.props.create()
                                }}>
                                선생님
                            </MenuItem>
                        </Menu>
                        <Button
                            style={{ float: 'left' }}
                            onClick={() => {
                                this.setState({
                                    showSignupMenu: !this.state?.showSignupMenu,
                                })
                            }}
                            disabled={!this.props.context.get('loaded')}>
                            계정 만들기
                        </Button>
                    </MenuSurfaceAnchor>
                    <Button
                        style={{ float: 'right' }}
                        raised
                        onClick={this.props.next}
                        disabled={!this.props.context.get('loaded')}>
                        다음
                    </Button>
                </div>
            </div>
        )
    }
}

export class PasswordForm extends React.Component<
    PasswordFormProps,
    PasswordFormState
> {
    firstInput: any

    public componentDidMount() {
        window.addEventListener('loginStateUpdate', () => {
            this.forceUpdate()
        })
        window.addEventListener('focusFrame', (e: CustomEvent) => {
            if (e.detail.frame === 'PasswordForm') this.firstInput.focus()
        })
    }

    public handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ password: e.target.value })
        this.props.context.set('password', e.target.value.trim())
    }

    public render() {
        let errS = this.props.context.get('errMessage')
        let errMessage = errS ? (
            <>
                <div
                    style={{
                        color: '#ff5959',
                        clear: 'both',
                        display: 'flex',
                        justifyContent: 'center',
                        margin: '20px',
                    }}>
                    <Icon icon={{ icon: 'error_outline', size: 'xsmall' }} />
                    <span style={{ padding: '3px' }}>{errS}</span>
                </div>
            </>
        ) : (
            <></>
        )
        return (
            <div
                style={{
                    width: this.props.isMobile ? 'calc(100vw - 60px)' : '380px',
                    padding: `5px ${this.props.isMobile ? 30 : 60}px`,
                    float: 'left',
                }}>
                <TextField
                    style={{ width: '100%' }}
                    outlined
                    label='비밀번호'
                    disabled={!this.props.context.get('loaded')}
                    value={this.state?.password}
                    onChange={this.handleChange.bind(this)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') this.props.next()
                    }}
                    invalid={!!errS}
                    name='pass'
                    type='password'
                    ref={(input) => {
                        this.firstInput = input
                    }}
                />
                <br />
                {errMessage}
                <br />
                <div
                    style={{
                        clear: 'both',
                        marginTop: '30px',
                        marginBottom: '30px',
                    }}>
                    <Button
                        style={{ float: 'left' }}
                        onClick={this.props.find}
                        disabled={!this.props.context.get('loaded')}>
                        비밀번호를 잊으셨나요?
                    </Button>
                    <Button
                        style={{ float: 'right' }}
                        raised
                        disabled={!this.props.context.get('loaded')}
                        onClick={this.props.next}>
                        로그인
                    </Button>
                </div>
            </div>
        )
    }
}
