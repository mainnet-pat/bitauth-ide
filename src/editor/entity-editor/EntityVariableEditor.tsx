import React, { useState } from 'react';
import './EntityVariableEditor.scss';
import { connect } from 'react-redux';
import {
  AppState,
  IDETemplateEntity,
  CurrentVariables,
  IDEVariable
} from '../../state/types';
import { unknownValue } from '../../utils';
import { Card, Elevation, Icon } from '@blueprintjs/core';
import { EditVariableDialog } from '../dialogs/edit-variable-dialog/EditVariableDialog';
import {
  variableIcon,
  wrapInterfaceTooltip,
  getCurrentVariables
} from '../common';
import { ActionCreators } from '../../state/reducer';

const variableName = (variable: IDEVariable) =>
  variable.type === 'CurrentBlockHeight'
    ? 'Current Block Height'
    : variable.type === 'CurrentBlockTime'
    ? 'Current Block Time'
    : variable.name;

const variableInitialDescription = (type: IDEVariable['type']) => {
  switch (type) {
    case 'WalletData':
    case 'AddressData':
      return '';
    case 'CurrentBlockHeight':
      return '';
    case 'CurrentBlockTime':
      return '';
    case 'HDKey':
      return '';
    case 'Key':
      return '';
    default:
      return unknownValue(type);
  }
};

interface EntityVariablesProps {
  entityInternalId: string;
  entity: IDETemplateEntity;
  variablesByInternalId: AppState['currentTemplate']['variablesByInternalId'];
  currentVariables: CurrentVariables;
}

interface EntityVariablesDispatch {
  upsertVariable: typeof ActionCreators.upsertVariable;
  deleteVariable: typeof ActionCreators.deleteVariable;
}

export const EntityVariableEditor = connect(
  (state: AppState, { entityInternalId }: { entityInternalId: string }) => ({
    entityInternalId: entityInternalId,
    entity: state.currentTemplate.entitiesByInternalId[entityInternalId],
    variablesByInternalId: state.currentTemplate.variablesByInternalId,
    currentVariables: getCurrentVariables(state)
  }),
  {
    upsertVariable: ActionCreators.upsertVariable,
    deleteVariable: ActionCreators.deleteVariable
  }
)((props: EntityVariablesProps & EntityVariablesDispatch) => {
  const [editingVariable, setEditingVariable] = useState(false);
  const [currentVariableInternalId, setCurrentVariableInternalId] = useState<
    string | undefined
  >(undefined);
  const [currentVariable, setCurrentVariable] = useState<
    IDEVariable | undefined
  >(undefined);
  return (
    <div className="EntityVariableEditor EditorPane">
      <h2>Entity Variables</h2>
      <div className="entity-variables">
        {props.entity.variableInternalIds.map(internalId => {
          const variable = props.variablesByInternalId[internalId];
          const name = variableName(variable);
          // const description =
          return (
            <Card
              key={internalId}
              className="variable"
              interactive={true}
              elevation={Elevation.TWO}
              onClick={() => {
                setCurrentVariableInternalId(internalId);
                setCurrentVariable(variable);
                setEditingVariable(true);
              }}
            >
              <h4 className="variable-header">
                <span>
                  {wrapInterfaceTooltip(
                    <Icon icon={variableIcon(variable.type)} iconSize={12} />,
                    variable.type
                  )}
                  {name}
                </span>
                <span className="identifier">{variable.id}</span>
              </h4>
              {variable.description && (
                <div className="description">{variable.description}</div>
              )}
            </Card>
          );
        })}
        <div
          className="add-variable"
          onClick={() => {
            setCurrentVariableInternalId(undefined);
            setCurrentVariable(undefined);
            setEditingVariable(true);
          }}
        >
          Add Variable...
        </div>
      </div>
      <EditVariableDialog
        isOpen={editingVariable}
        closeDialog={() => {
          setEditingVariable(false);
          setCurrentVariableInternalId(undefined);
          setCurrentVariable(undefined);
        }}
        entity={props.entity}
        variable={currentVariable}
        variableInternalId={currentVariableInternalId}
        currentVariables={props.currentVariables}
        upsertVariable={props.upsertVariable}
        deleteVariable={props.deleteVariable}
      />
    </div>
  );
});
