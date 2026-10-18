---
id: escalamiento-robusto
titulo: Escalamiento robusto
titulo_en: Robust scaling
alias:
  - escalamiento por mediana y rango intercuartílico
  - robust scaler
modulo: 12
submodulo: '12.3'
orden: 3
nivel: basico
prerrequisitos:
  - estandarizacion
  - rango-intercuartilico
etiquetas:
  - escalamiento
  - estadística robusta
  - valores atípicos
  - preprocesamiento
resumen: >
  El escalamiento robusto resta la mediana y divide entre el rango intercuartílico. Como ambos estadísticos
  ignoran los extremos, la escala de los datos comunes no cambia aunque haya valores muy alejados.
formula: "x' = \\frac{x - \\operatorname{mediana}(x)}{Q_3 - Q_1}"
visualizacion:
  componente: FeatureEngineeringViz
  parametros:
    modo: escalamiento
    metodo: robusto
    caso: clientes
    atipico: true
referencias:
  - clave: hastie-esl
  - clave: wasserman
publicado: true
---

## Intuición

Entre los clientes de una tienda hay una persona que gana 250 mil pesos al mes; los demás ganan entre 15 y 47 mil. Con el escalamiento min-max, ese cliente fija el máximo y todos los demás quedan apretados entre 0 y 0.13. Con la estandarización, su ingreso infla la media y, sobre todo, la desviación estándar, y los ingresos comunes quedan casi indistinguibles entre sí.

El **escalamiento robusto** usa referencias que no se mueven por un solo valor: la mediana como centro y el rango intercuartílico (la anchura del 50 % central de los datos) como unidad. El cliente rico queda muy lejos, a más de 11 unidades, pero los demás conservan una escala útil: un cliente con ingreso 0.5 está medio rango intercuartílico por encima de la mediana. El valor extremo no se elimina ni se modifica; simplemente deja de decidir la escala de los demás.

## Definición

:::definicion[Escalamiento robusto]
Para una variable con mediana $\operatorname{mediana}(x)$ y cuartiles $Q_1$ y $Q_3$, el valor **escalado de forma robusta** es

$$
x_i' = \frac{x_i - \operatorname{mediana}(x)}{Q_3 - Q_1}.
$$

La mediana de los valores escalados es $0$ y su rango intercuartílico es $1$. Los tres estadísticos se calculan con los datos de entrenamiento.
:::

:::nota[Qué significa cada símbolo]
- $x_i$: valor original de la observación $i$.
- $\operatorname{mediana}(x)$: valor central de la variable.
- $Q_1$, $Q_3$: primer y tercer cuartil.
- $Q_3 - Q_1$: rango intercuartílico, la anchura del 50 % central.
- $x_i'$: valor escalado.
:::

## Cómo usar la visualización

La vista empieza con el cliente extremo incluido. Los puntos se dibujan con la misma escala en ambos ejes y se transforman de unidades originales a valores escalados. Las lecturas muestran la mediana y el rango intercuartílico de cada variable y el rango final del ingreso escalado. El punto de consulta y su vecino más cercano se unen con una línea naranja.

Experimentos sugeridos: cambiar el método a min-max y a estandarización con el mismo extremo y comparar cuánto se dispersan los clientes comunes; desactivar el extremo y comprobar que los tres métodos dan resultados parecidos.

## Ejemplo

Los ingresos de once clientes, incluido el de 250 mil pesos, tienen mediana 31000, $Q_1 = 21750$ y $Q_3 = 40500$; el rango intercuartílico es 18750.

1. Ana, 21000: $(21000 - 31000)/18750 = -0.53$.
2. Hugo, 47000: $(47000 - 31000)/18750 = 0.85$.
3. Cliente extremo, 250000: $(250000 - 31000)/18750 = 11.68$.
4. Los diez clientes comunes quedan entre $-0.83$ y $0.85$.
5. Con estandarización, la media es 49727 y la desviación 67206: los diez comunes quedan entre $-0.51$ y $-0.04$, un rango tres veces más estrecho, y el extremo en 2.98.

:::figura[Comparación del paso 5: los mismos clientes estandarizados con media y desviación estándar; los diez ingresos comunes quedan juntos entre -0.51 y -0.04, mientras que la visualización principal los separa entre -0.83 y 0.85.]{componente="FeatureEngineeringViz"}
```yaml
modo: escalamiento
metodo: estandar
caso: clientes
atipico: true
```
:::

## Propiedades

- **Punto de ruptura alto.** La mediana y los cuartiles soportan que hasta una cuarta parte de los datos sea arbitrariamente extrema sin cambiar mucho.
- **No acota el rango.** A diferencia del min-max, los valores escalados no quedan en un intervalo fijo; los extremos conservan su lejanía.

:::figura[Casas con una que tiene 12 recámaras: la mediana es 3 y el rango intercuartílico 2; sin esa casa serían 2.5 y 1.75. Cambian poco, así que las casas comunes conservan casi su escala y la de 12 recámaras queda en 4.5.]{componente="FeatureEngineeringViz"}
```yaml
modo: escalamiento
metodo: robusto
caso: casas
atipico: true
```
:::

- **Coincide en espíritu con la estandarización en datos normales.** Para una normal, el rango intercuartílico es $1.349\,\sigma$, así que los valores robustos son las puntuaciones z divididas entre 1.349.

## Errores comunes

- **Usarlo como sustituto de revisar los extremos.** Si el valor extremo es un error de captura, escalar de forma robusta no lo corrige; solo evita que dañe la escala de los demás.
- **Esperar valores entre 0 y 1.** Los modelos que suponen entradas acotadas, como algunas redes con funciones de activación saturadas, pueden necesitar además un recorte.
- **Aplicarlo a variables con rango intercuartílico cero.** Si más de la mitad de los valores son iguales (muchos ceros, por ejemplo), el denominador es cero y el escalamiento no está definido.

:::figura[Error de esperar un rango acotado: los atletas con un tiempo de 19.5 segundos, escalados de forma robusta, dejan ese tiempo en 5.5 unidades, muy fuera de cualquier intervalo fijo.]{componente="FeatureEngineeringViz"}
```yaml
modo: escalamiento
metodo: robusto
caso: atletas
atipico: true
```
:::

## Conexiones

Usa la [[mediana]] y el [[rango-intercuartilico]], las mismas medidas resistentes del [[diagrama-de-caja]]. Es la versión robusta de la [[estandarizacion]] y una alternativa al [[escalamiento-min-max]] cuando hay [[valores-atipicos-vs-errores-de-captura|valores atípicos]] legítimos. Otra forma de limitar la influencia de los extremos, que sí los modifica, es la [[winsorizacion]].

## Formulario

:::formula[Escalamiento robusto]
$$
x' = \frac{x - \operatorname{mediana}(x)}{Q_3 - Q_1}
$$

- $x$: valor original; $x'$: valor escalado.
- $\operatorname{mediana}(x)$: mediana de entrenamiento.
- $Q_1$, $Q_3$: cuartiles de entrenamiento.
:::

:::formula[Rango intercuartílico de una normal]
$$
Q_3 - Q_1 = 2\,\Phi^{-1}(0.75)\,\sigma \approx 1.349\,\sigma
$$

- $\Phi^{-1}$: cuantil de la normal estándar.
- $\sigma$: desviación estándar de la normal.
:::
