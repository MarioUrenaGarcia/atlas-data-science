---
id: muestreo-por-cuotas
titulo: Muestreo por cuotas
titulo_en: Quota sampling
alias:
  - cuotas
  - muestreo no probabilístico por cuotas
modulo: 5
submodulo: '5.1'
orden: 9
nivel: basico
prerrequisitos:
  - muestreo-estratificado
relaciones:
  - tipo: contrasta
    id: muestreo-estratificado
etiquetas:
  - muestreo no probabilístico
  - encuestas de opinión
  - sesgo
  - composición de la muestra
resumen: >
  Se fija cuántas personas de cada grupo debe tener la muestra y el encuestador las elige libremente.
  La composición coincide con la de la población, pero la selección dentro de cada grupo puede sesgar.
formula: 'n_h = n\,W_h \quad \text{(cuota)}, \qquad \mathbb{E}[\bar{y}_{\mathrm{cuotas}}] = \sum_h W_h\,\bar{Y}_h^{\mathrm{acc}} \ne \bar{Y}'
visualizacion:
  componente: SurveySampler
  parametros:
    diseno: cuotas
    disenos: [cuotas, estratificado]
    n: 36
    repeticiones: 300
    poblacion:
      columnas: 24
      filas: 12
      estratos:
        - nombre: 18 a 34 años
          media: 6.2
        - nombre: 35 a 54 años
          media: 4.6
        - nombre: 55 años o más
          media: 3.1
      desviacion: 1.3
      icc: 0.1
      tendencia: 2.4
      minimo: 0
      decimales: 1
      variable: Horas diarias frente a pantallas
      unidad: h
      nombreUnidad: Persona
referencias:
  - clave: lohr
    capitulo: '1'
publicado: true
---

## Intuición

Una agencia de mercadotecnia necesita 36 entrevistas sobre uso de pantallas y sabe que un tercio de los adultos de la ciudad tiene entre 18 y 34 años, otro tercio entre 35 y 54, y el resto 55 o más. Le da al encuestador una instrucción sencilla: consigue 12 personas de cada grupo. El encuestador se para en una plaza comercial y entrevista a quien acepte, hasta llenar cada cuota.

La muestra resultante tiene exactamente la composición por edad de la ciudad, y eso la hace parecer representativa. Pero dentro de cada grupo, ¿quién estaba en la plaza a media tarde y aceptó detenerse? Personas que pasean, que no trabajan en horario de oficina, que viven cerca. Si esas personas usan más o menos pantallas que el resto de su grupo de edad, la estimación hereda ese sesgo, y ningún cálculo con la muestra lo revela. El **muestreo por cuotas** controla la composición, pero no la selección dentro de cada grupo.

## Definición

:::definicion[Muestreo por cuotas]
La población se divide en grupos con pesos conocidos $W_h = N_h/N$ (por edad, sexo, región). Se fija una **cuota** $n_h$ para cada grupo, normalmente $n_h = n\,W_h$, y las unidades se eligen por cualquier procedimiento no aleatorio hasta completar cada cuota.
:::

Si dentro del grupo $h$ las unidades que terminan en la muestra son las "accesibles", con media $\bar{Y}_h^{\mathrm{acc}}$, la media muestral estima
$$
\mathbb{E}[\bar{y}_{\mathrm{cuotas}}] = \sum_h W_h\,\bar{Y}_h^{\mathrm{acc}},
$$
que coincide con $\bar{Y} = \sum_h W_h \bar{Y}_h$ solo si en cada grupo los accesibles se parecen en promedio al resto. El sesgo es
$$
\operatorname{Sesgo} = \sum_h W_h\left(\bar{Y}_h^{\mathrm{acc}} - \bar{Y}_h\right).
$$
Como no hay probabilidades de inclusión conocidas, tampoco hay una fórmula válida para el error estándar.

:::nota[Qué significa cada símbolo]
- $h$: índice de grupo; $W_h$: peso del grupo en la población.
- $n_h$: cuota del grupo $h$; $n$: tamaño total.
- $\bar{Y}_h$: media real del grupo $h$.
- $\bar{Y}_h^{\mathrm{acc}}$: media de las personas del grupo que el encuestador tiende a alcanzar.
- $\bar{y}_{\mathrm{cuotas}}$: media de la muestra por cuotas.
:::

## Cómo usar la visualización

Las franjas son los grupos de edad; el tono indica las horas frente a pantallas. El recuadro rojo marca el punto de acceso, la plaza donde trabaja el encuestador. Al reproducir, cada grupo recibe 12 personas, pero se eligen las más cercanas al acceso. El histograma acumula 300 repeticiones.

Experimentos sugeridos:

- Observa que el histograma queda lejos de la línea de la media real aunque las cuotas se cumplen siempre.
- Cambia a muestreo estratificado, que sortea dentro de cada grupo: el histograma se centra en la media real.
- Compara el ancho de ambos histogramas: el de cuotas es angosto, lo que da una falsa sensación de precisión.

## Ejemplo

Una ciudad tiene tres grupos de edad con pesos $0.30$, $0.40$ y $0.30$ y medias reales de 6.2, 4.6 y 3.1 horas.

1. Media real: $0.30 \cdot 6.2 + 0.40 \cdot 4.6 + 0.30 \cdot 3.1 = 4.63$ horas.
2. Con $n = 50$, las cuotas son 15, 20 y 15 personas.
3. En la plaza, las personas de cada grupo usan pantallas 0.8 horas menos que el promedio de su grupo, porque están de paseo y no en una oficina: $\bar{Y}_h^{\mathrm{acc}} = 5.4$, $3.8$ y $2.3$.
4. La media esperada de la muestra es $0.30 \cdot 5.4 + 0.40 \cdot 3.8 + 0.30 \cdot 2.3 = 3.83$ horas.
5. El sesgo es $-0.8$ horas, y no se puede detectar con los datos: la muestra tiene la composición correcta.

:::figura[Una sola muestra por cuotas: cada grupo de edad recibe su cuota, pero las personas elegidas se concentran cerca del punto de acceso.]{componente="SurveySampler"}
```yaml
diseno: cuotas
n: 36
repeticiones: 1
poblacion:
  columnas: 24
  filas: 12
  estratos:
    - nombre: 18 a 34 años
      media: 6.2
    - nombre: 35 a 54 años
      media: 4.6
    - nombre: 55 años o más
      media: 3.1
  desviacion: 1.3
  icc: 0.1
  tendencia: 2.4
  minimo: 0
  decimales: 1
  variable: Horas diarias frente a pantallas
  unidad: h
  nombreUnidad: Persona
```
:::

## Propiedades

- **Controla la composición de la muestra** en las variables de las cuotas, igual que la estratificación.
- **No controla la selección dentro de los grupos**: el sesgo depende de cuánto difieren los accesibles del resto, y no se corrige al aumentar $n$; solo baja cuando la muestra llega a abarcar una parte grande de cada grupo.
- **Funciona bien solo si la accesibilidad no está relacionada con la variable**, algo que no se puede verificar con la propia muestra.
- **Es rápido y barato**, por eso se usa en estudios de mercado y en sondeos con plazos cortos.

:::figura[Propiedad sin sesgo: si en una fábrica la cercanía a la entrada no tiene relación con la antigüedad de los trabajadores, las cuotas por turno dan estimaciones centradas en la media real.]{componente="SurveySampler"}
```yaml
diseno: cuotas
disenos: [cuotas, estratificado]
n: 36
repeticiones: 300
poblacion:
  columnas: 24
  filas: 12
  estratos:
    - nombre: Turno matutino
      media: 9
    - nombre: Turno vespertino
      media: 6
    - nombre: Turno nocturno
      media: 4
  desviacion: 2.5
  icc: 0
  minimo: 0
  decimales: 1
  variable: Antigüedad
  unidad: años
  nombreUnidad: Trabajador
```
:::

:::figura[Propiedad de independencia respecto de n: en una ciudad con 1200 personas, 120 entrevistas por cuotas dan un histograma más angosto que sigue igual de lejos de la media real.]{componente="SurveySampler"}
```yaml
diseno: cuotas
n: 120
nMaximo: 200
repeticiones: 300
poblacion:
  columnas: 40
  filas: 30
  estratos:
    - nombre: 18 a 34 años
      media: 6.2
    - nombre: 35 a 54 años
      media: 4.6
    - nombre: 55 años o más
      media: 3.1
  desviacion: 1.3
  icc: 0.1
  tendencia: 2.4
  minimo: 0
  decimales: 1
  variable: Horas diarias frente a pantallas
  unidad: h
  nombreUnidad: Persona
```
:::

## Errores comunes

- **Confundir cuotas con estratificación.** La diferencia no está en la composición, que es la misma, sino en que la estratificación sortea dentro de cada estrato.
- **Reportar un margen de error.** Las fórmulas del margen de error suponen probabilidades de inclusión conocidas; en una muestra por cuotas no existen y el número reportado no mide la incertidumbre real.
- **Creer que más cuotas cruzadas eliminan el sesgo.** Cruzar edad con sexo y región reduce algunas diferencias, pero el encuestador sigue eligiendo a quién es fácil de alcanzar dentro de cada celda.

:::figura[Error de reportar un margen de error: el histograma de las encuestas por cuotas es angosto, como si la estimación fuera precisa, pero casi ninguna repetición contiene la media real.]{componente="SurveySampler"}
```yaml
diseno: cuotas
n: 60
nMaximo: 200
repeticiones: 300
poblacion:
  columnas: 24
  filas: 12
  estratos:
    - nombre: Mujeres
      media: 0.55
    - nombre: Hombres
      media: 0.45
  desviacion: 1
  icc: 0.1
  tendencia: 1.6
  binaria: true
  variable: Aprueba el nuevo reglamento de tránsito
  nombreUnidad: Persona
```
:::

## Conexiones

El muestreo por cuotas imita la composición de un [[muestreo-estratificado]] sin su sorteo, y comparte con el muestreo por conveniencia la falta de probabilidades de inclusión conocidas. Su sesgo tiene la misma estructura que el de un [[marco-muestral]] incompleto: depende de cuánto difieren las unidades alcanzadas de las demás. Los pesos de la ponderación y post-estratificación tampoco lo corrigen, porque ya coinciden con los de la población.

## Formulario

:::formula[Cuota proporcional]
$$
n_h = n\,W_h, \qquad W_h = \frac{N_h}{N}
$$

- $n_h$: número de unidades del grupo $h$; $n$: tamaño total.
- $W_h$: peso del grupo en la población.
:::

:::formula[Valor esperado de la media por cuotas]
$$
\mathbb{E}[\bar{y}_{\mathrm{cuotas}}] = \sum_h W_h\,\bar{Y}_h^{\mathrm{acc}}
$$

- $\bar{Y}_h^{\mathrm{acc}}$: media de las unidades accesibles del grupo $h$.
:::

:::formula[Sesgo del muestreo por cuotas]
$$
\operatorname{Sesgo} = \sum_h W_h\left(\bar{Y}_h^{\mathrm{acc}} - \bar{Y}_h\right)
$$

- $\bar{Y}_h$: media real del grupo $h$.
- El sesgo es nulo si en cada grupo los accesibles tienen la misma media que el grupo completo.
:::
