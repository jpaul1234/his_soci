import React from 'react';
import {
  rankWith,
  scopeEndsWith,
  computeLabel,
  isDescriptionHidden,
  isPlainLabel,
  or,
  optionIs,
} from '@jsonforms/core';
import { Hidden } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';

import merge from 'lodash/merge';
import { Control,withJsonFormsControlProps } from '@jsonforms/react';

const checkInputControl = or(optionIs('generated',true),
or(optionIs('custom',true),scopeEndsWith('properties/id')));
/**
 * Default tester for custom input controls.
 * @type {RankedTester}
 */
export const customInputControlTester =
  rankWith(Number.MAX_VALUE, checkInputControl );


export class customInputControl extends Control {

  /**
   * @inheritDoc
   */
  render() {
   const {
      id,
      errors,
      label,
      schema,
      description,
      visible,
      required,
      path,
      handleChange,
      data,
      config
    } = this.props;
    const isValid = errors.length === 0;
    const appliedUiSchemaOptions = merge(
      {},
      config,
      this.props.uischema.options
    );
    const toNumber = (value) =>
    value === '' ? undefined : parseInt(value, 10);

    const onChange = (ev) => {
      if(schema.type === 'integer'){
        handleChange(path, toNumber(ev.target.value));
      }
      else{
        handleChange(path, ev.target.value)
      }      
    };
    const fieldType = schema.format === 'password'?'password':'text';
    const readOnly = schema.readOnly  || appliedUiSchemaOptions.readOnly;
    const maxLength = schema.maxLength;

    const showDescription = !isDescriptionHidden(
      visible,
      description,
      this.state.isFocused,
      appliedUiSchemaOptions.showUnfocusedDescription
    );
    return (
      <div
        style={{ paddingTop: '1.5em' }}
      >
        <Hidden xsUp={!visible}>
            <TextField
            id={id + '-input'}
            label={computeLabel(
              isPlainLabel(label) ? label : label.default,
              required,
              appliedUiSchemaOptions.hideRequiredAsterisk
            )}
            type={fieldType}
            error={!isValid}
            fullWidth={!appliedUiSchemaOptions.trim  || maxLength === undefined}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            helperText={!isValid ? errors : showDescription ? description : null}
            InputLabelProps={{ shrink: true }}
            margin="normal"
            variant={ appliedUiSchemaOptions.variant }
            InputProps={{
              readOnly
            }}
            multiline={ appliedUiSchemaOptions.multi }
            rows={ appliedUiSchemaOptions.rows }
            rowsMax={ appliedUiSchemaOptions.rows }
            value={ data  || ''}
            onChange={onChange}
          />
        </Hidden>
      </div>
    );
  }
}

export default withJsonFormsControlProps(customInputControl);
